import { GLError, LintResult, Linters, Result, ShellExec } from '.';
import commandExists from 'command-exists';
import semver from 'semver';

export class Linter {
  private name: string;
  private version: string;
  private options: string;

  public constructor(name: string, range: string, options: string) {
    if (Linters[name] === undefined) {
      throw new GLError(`Linter '${name}' is not supported.`);
    }

    this.name = name;
    this.options = options || undefined;
    this.ValidateExists();
    this.GetVersion();

    if (range !== undefined && !this.SatisfiesRange(range)) {
      throw new GLError(
        `${this.name} ${this.version} does not satisfy ${range}.`
      );
    }
  }

  public SupportsJsonFormat(): boolean {
    if (
      Linters[this.name].jsonFormat !== undefined &&
      Linters[this.name].jsonFormat.sinceVersion === undefined
    ) {
      throw new GLError("Option 'jsonFormat.sinceVersion' is not configured.");
    }

    return this.SatisfiesRange(Linters[this.name].jsonFormat.sinceVersion);
  }

  private SatisfiesRange(range: string): boolean {
    if (!semver.validRange(range)) {
      throw new GLError(`'${range}' is not a valid semver range.`);
    }

    return semver.satisfies(this.version, range);
  }

  private ValidateExists(): void {
    if (!commandExists.sync(this.name)) {
      throw new GLError(`Could not find executable '${this.name}'.`);
    }
  }

  private GetVersion(): void {
    const command = `${this.name} ${Linters[this.name].versionOption}`;
    const shellResult = ShellExec(command, { silent: true });

    const semverResult = semver.coerce(shellResult.stdout);
    if (semverResult === null) {
      throw new GLError(`Could find version in output of '${command}'.`);
    }

    this.version = semverResult.version;
  }

  private parseJsonResult(
    lintResults: LintResult[],
    file: string,
    result: Result
  ): void {
    lintResults.forEach((lintResult): void => {
      result.results.push({
        message: lintResult.message,
        file,
        line: lintResult.line,
        column: lintResult.column,
        level: lintResult.level,
        code: lintResult.code,
      });

      switch (lintResult.level) {
        case 'error':
          result.summary.count.error++;
          break;
        case 'warning':
          result.summary.count.warning++;
          break;
        case 'info':
          result.summary.count.info++;
          break;
        default:
          result.summary.count.other++;
          break;
      }
    });
  }

  public LintFiles(files: string[]): Result {
    let result: Result = {
      type: this.SupportsJsonFormat() ? 'JSON' : 'plain-text',
      results: [],
      summary: {
        count: {
          error: 0,
          warning: 0,
          info: 0,
          other: 0,
        },
      },
    };

    let command = `${this.name}`;
    if (this.SupportsJsonFormat()) {
      command += ` ${Linters[this.name].jsonFormat.option}`;
    }
    if (this.options) {
      command += ` ${this.options}`;
    }

    files.forEach((file): void => {
      const shellResult = ShellExec(`${command} ${file}`, { silent: true });

      if (!shellResult.stdout) {
        return;
      }

      if (this.SupportsJsonFormat()) {
        const jsonShellResult = JSON.parse(shellResult.stdout);
        this.parseJsonResult(jsonShellResult, file, result);
      } else {
        shellResult.stdout.split(/\r|\n|\r\n/).forEach((line): void => {
          result.results.push({
            message: line,
            file,
          });
        });
      }
    });

    return result;
  }
}
