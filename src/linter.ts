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

interface ResultLengths {
  line: number;
  code: number;
  message: number;
  column: number;
  level: number;
}

interface ResultCount {
  error: number;
  warning: number;
  info: number;
  other: number;
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

  public SupportsJsonFormat(): boolean {
    if (
      Linters[this.name].jsonFormat !== undefined &&
      Linters[this.name].jsonFormat.sinceVersion === undefined
    ) {
      throw new Error(
        chalk.red("Option 'jsonFormat.sinceVersion' is not configured.")
      );
    }

    return this.SatisfiesRange(Linters[this.name].jsonFormat.sinceVersion);
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

  private GetMaxLengths(results: Result[]): ResultLengths {
    let lengths: ResultLengths = {
      code: 0,
      message: 0,
      line: 0,
      column: 0,
      level: 0,
    };

    results.forEach((result): void => {
      if (result.code.length > lengths.code) {
        lengths.code = result.code.length;
      }
      if (result.message.length > lengths.message) {
        lengths.message = result.message.length;
      }
      const lineString = result.line.toString(10);
      if (lineString.length > lengths.line) {
        lengths.line = lineString.length;
      }
      const columnString = result.column.toString(10);
      if (columnString.length > lengths.column) {
        lengths.column = columnString.length;
      }
      if (result.level.length > lengths.level) {
        lengths.level = result.level.length;
      }
    });

    return lengths;
  }

  private Pluralise(word: string, count: number): string {
    return count === 1 ? word : `${word}s`;
  }

  private PrintJsonResults(results: Result[]): ResultCount {
    const lengths = this.GetMaxLengths(results);

    let resultCount: ResultCount = {
      error: 0,
      warning: 0,
      info: 0,
      other: 0,
    };

    results.forEach((result): void => {
      let levelColour;
      switch (result.level) {
        case 'error':
          levelColour = 'red';
          resultCount.error++;
          break;
        case 'warning':
          levelColour = 'yellow';
          resultCount.warning++;
          break;
        case 'info':
          levelColour = 'white';
          resultCount.info++;
          break;
        default:
          levelColour = 'yellow';
          resultCount.other++;
          break;
      }

      console.log(
        [
          '',
          chalk.dim(
            `${result.line
              .toString(10)
              .padStart(lengths.line)}:${result.column
              .toString(10)
              .padEnd(lengths.column)}`
          ),
          chalk[levelColour](`${result.level.padEnd(lengths.level)}`),
          result.message.padEnd(lengths.message),
          chalk.dim(result.code),
        ].join('  ')
      );
    });
    console.log('');

    return resultCount;
  }

  public LintFiles(files: string[]): void {
    let resultCount: ResultCount = {
      error: 0,
      warning: 0,
      info: 0,
      other: 0,
    };

    let command = `${this.name}`;
    if (this.SupportsJsonFormat()) {
      command += ` ${Linters[this.name].jsonFormat.option}`;
    }

    files.forEach((file): void => {
      const shellResult = ShellExec(`${command} ${file}`, { silent: true });

      const jsonShellResult = JSON.parse(shellResult.stdout);
      if (
        !shellResult.stdout ||
        jsonShellResult === undefined ||
        jsonShellResult.length === 0
      ) {
        return;
      }

      console.log(chalk.underline(file));
      if (this.SupportsJsonFormat()) {
        const count = this.PrintJsonResults(jsonShellResult);
        resultCount.error += count.error;
        resultCount.warning += count.warning;
        resultCount.info += count.info;
        resultCount.other += count.other;
      } else {
        const lintResult = shellResult.stdout
          .split(/(\r|\n|\r\n)/)
          .map((line): string => {
            return `  ${line}`;
          })
          .join('');
        console.log(chalk.yellow(lintResult));
      }
    });

    const total = resultCount.error + resultCount.warning;
    if (total > 0) {
      console.log(
        chalk['yellow'].bold(
          [
            `✗ ${total} ${this.Pluralise('problem', total)}`,
            ` (${resultCount.error} `,
            this.Pluralise('error', resultCount.error),
            `, ${resultCount.warning} `,
            this.Pluralise('warning', resultCount.warning),
            ')\n',
          ].join('')
        )
      );
    }
  }
}
