import chalk from 'chalk';
import commandExists from 'command-exists';
import semver from 'semver';
import shell from 'shelljs';

export type LinterNames = 'hadolint' | 'shellcheck';

export class Linter {
  private name: LinterNames;
  private range: string;
  private version: string;

  public constructor(name: LinterNames, range: string) {
    this.name = name;
    this.range = range;
    this.ValidateRange();

    this.Exists();
    this.Version();
    this.SatisfiesRange();
  }

  private ValidateRange(): void {
    if (this.range !== undefined && !semver.validRange(this.range)) {
      throw new Error(
        chalk.red(`'${this.range}' is not a valid semver range.`)
      );
    }
  }

  private SatisfiesRange(): void {
    if (this.range != undefined) {
      if (!semver.satisfies(this.version, this.range)) {
        throw new Error(
          chalk.red(
            `${this.name} ${this.version} does not satisfy ${this.range}.`
          )
        );
      }
    }
  }

  private Exists(): void {
    if (!commandExists.sync(this.name)) {
      throw new Error(chalk.red(`Could not find executable '${this.name}'.`));
    }
  }

  private Version(): void {
    const versionResponse = shell.exec(`${this.name} --version`, {
      silent: true,
    }).stdout;

    const semverResult = semver.coerce(versionResponse);
    if (semverResult === null) {
      throw new Error(
        chalk.red(
          `Could not get version from ${this.name} using '${this.name} --version'.`
        )
      );
    }

    this.version = semverResult.version;
  }

  public Name(): LinterNames {
    return this.name;
  }

  public Range(): string {
    return this.range;
  }

  public LintFile(file: string): void {
    console.log(chalk.green(`☯ Processing ${file}`));
    const lintOutput = shell.exec(`${this.name} ${file}`, {
      silent: true,
    }).stdout;

    const lintResult = lintOutput
      .split(/(\r|\n|\r\n)/)
      .map((line): string => {
        return `  ${line}`;
      })
      .join('');
    console.log(chalk.yellow(lintResult));
  }

  public LintFiles(files: string[]): void {
    files.forEach((file): void => {
      this.LintFile(file);
    });
  }
}
