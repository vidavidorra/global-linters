import chalk from 'chalk';
import commandExists from 'command-exists';
import semver from 'semver';
import shell from 'shelljs';

export class Linter {
  private name: string;
  private range: string;
  private version: string;

  public constructor(name: string, range: string) {
    this.name = name;
    this.range = range;
    this.ValidateRange();

    this.Exists();
    this.Version();
    this.SatisfiesRange();
  }

  private ValidateRange(): void {
    if (this.range !== undefined && !semver.validRange(this.range)) {
      throw new Error(`'${this.range}' is not a valid semver range.`);
    }
  }

  /**
   * @todo Add note in readme for usage of the range option with linter versions.
   * Ranges from https://github.com/npm/node-semver#ranges.
   *
   * Version usage based on the shellcheck source files. This option was added in
   * v0.3.1, so the version validation only works for shellcheck >=0.3.1.
   *
   * v0.3.1: https://github.com/koalaman/shellcheck/blob/v0.3.1/shellcheck.hs#L297
   * v0.6.0: https://github.com/koalaman/shellcheck/blob/v0.6.0/shellcheck.hs#L418
   *
   * Version usage based on the hadolint source files. This option was added in
   * v1.2.0, so the version validation only works for hadolint >=1.2.0.
   * https://github.com/hadolint/hadolint/releases/tag/v1.2
   *
   * v1.2.0: https://github.com/hadolint/hadolint/blob/v1.2/app/Main.hs#L54
   * v1.16.3: https://github.com/hadolint/hadolint/blob/v1.16.3/app/Main.hs#L121
   */
  private SatisfiesRange(): void {
    if (this.range != undefined) {
      if (!semver.satisfies(this.version, this.range)) {
        throw new Error(
          `'${this.name} v${this.version} does not satisfy ${this.range}.`
        );
      }
    }
  }

  private Exists(): void {
    if (!commandExists.sync(this.name)) {
      throw new Error(`Could not find executable for '${this.name}'.`);
    }

    console.log(chalk.green(`☯ Found ${this.name} executable`));
  }

  private Version(): void {
    const versionResponse = shell.exec(`${this.name} --version`, {
      silent: true,
    }).stdout;

    const semverResult = semver.coerce(versionResponse);
    if (semverResult === null) {
      throw new Error(
        `Could not get version from ${this.name} using '${this.name} --version'.`
      );
    }

    this.version = semverResult.version;
    console.log(chalk.green(`☯ Found ${this.name} ${this.version}`));
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
