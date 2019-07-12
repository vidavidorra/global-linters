import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import ignore from 'ignore';
import isGlob from 'is-glob';

export class Glob {
  private pattern: string;
  private ignorePath: string;
  private files: string[];

  public constructor(pattern: string, ignorePath: string) {
    const defaultIgnoreFile = '.prettierignore';
    this.pattern = pattern;
    this.ignorePath = ignorePath;
    if (!this.ignorePath && fs.existsSync(defaultIgnoreFile)) {
      this.ignorePath = defaultIgnoreFile;
    }

    this.ValidatePattern();
    this.ValidateIgnoreFile();
  }

  private ValidatePattern(): void {
    if (this.pattern !== undefined && !isGlob(this.pattern)) {
      throw new Error(
        chalk.red(`'${this.pattern}' is not a valid glob pattern.`)
      );
    }

    console.log(chalk.green(`☷ Pattern '${this.pattern}' is valid.`));
  }

  private ValidateIgnoreFile(): void {
    if (this.ignorePath !== undefined && !fs.existsSync(this.ignorePath)) {
      throw new Error(
        chalk.red(`Ignore path '${this.ignorePath}' doesn't exist.`)
      );
    }

    console.log(chalk.green(`☷ Ingorefile ${this.ignorePath} found.`));
  }

  public Files(): string[] {
    this.files = glob.sync(this.pattern);

    if (this.ignorePath !== undefined) {
      this.files = ignore()
        .add(fs.readFileSync(this.ignorePath).toString())
        .filter(this.files);
    }

    console.log(chalk.green(`☷ Matched files using '${this.pattern}'`));

    this.files.forEach((file): void => {
      console.log(chalk.greenBright(` ☷ ${file}`));
    });

    return this.files;
  }
}
