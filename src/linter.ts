import { Linters } from '.';
import { ShellExec } from '.';
import chalk from 'chalk';
import commandExists from 'command-exists';
import semver from 'semver';

interface Result {
  line: number;
  code: string;
  message: string;
  column: number;
  file: string;
  level: string;
}

export class Linter {
  private name: string;
  private version: string;

  public constructor(name: string, range: string) {
    if (Linters[name] === undefined) {
      throw new Error(chalk.red(`Linter '${name}' is not supported.`));
    }

    this.name = name;
    this.ValidateExists();
    this.GetVersion();

    if (range !== undefined && !this.SatisfiesRange(range)) {
      throw new Error(
        chalk.red(`${this.name} ${this.version} does not satisfy ${range}.`)
      );
    }
  }

  private SatisfiesRange(range: string): boolean {
    if (!semver.validRange(range)) {
      throw new Error(chalk.red(`'${range}' is not a valid semver range.`));
    }

    return semver.satisfies(this.version, range);
  }

  private ValidateExists(): void {
    if (!commandExists.sync(this.name)) {
      throw new Error(chalk.red(`Could not find executable '${this.name}'.`));
    }
  }

  private GetVersion(): void {
    const command = `${this.name} ${Linters[this.name].versionOption}`;
    const shellResult = ShellExec(command, { silent: true });

    const semverResult = semver.coerce(shellResult.stdout);
    if (semverResult === null) {
      throw new Error(
        chalk.red(`Could find version in output of '${command}'.`)
      );
    }

    this.version = semverResult.version;
  }

  private SupportsJsonFormat(): boolean {
    if (
      Linters[this.name].jsonFormat !== undefined &&
      Linters[this.name].jsonFormat.sinceVersion === undefined
    ) {
      throw new Error(
        chalk.red("Option 'jsonFormat.sinceVersion' is not configured.")
      );
    }

    return (
      Linters[this.name].jsonFormat !== undefined &&
      this.SatisfiesRange(Linters[this.name].jsonFormat.sinceVersion)
    );
  }

  private PrintJsonResults(results: Result[]): void {
    results.forEach((result): void => {
      const outputSections = [
        chalk.dim(`${result.line}:${result.column}`),
        chalk.yellow(`${result.level}`),
        result.message,
        chalk.dim(result.code),
      ];

      console.log('  ' + outputSections.join('  '));
    });
  }

  private LintFile(file: string): void {
    console.log(chalk.green(`☯ Processing ${file}`));
    const supportsJsonFormat = this.SupportsJsonFormat();

    let command = `${this.name} ${file}`;
    if (supportsJsonFormat) {
      command += ` ${Linters[this.name].jsonFormat.option}`;
    }

    const shellResult = ShellExec(command, { silent: true });

    console.log(chalk.underline(file));
    if (supportsJsonFormat) {
      this.PrintJsonResults(JSON.parse(shellResult.stdout));
    } else {
      const lintResult = shellResult.stdout
        .split(/(\r|\n|\r\n)/)
        .map((line): string => {
          return `  ${line}`;
        })
        .join('');
      console.log(chalk.yellow(lintResult));
    }
  }

  public LintFiles(files: string[]): void {
    files.forEach((file): void => {
      this.LintFile(file);
    });
  }
}
