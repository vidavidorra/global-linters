import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import ignore from 'ignore';
import isGlob from 'is-glob';
import path from 'path';

export class Glob {
  private readonly defaultIgnoreFile = '.prettierignore';
  private pattern: string;
  private ignorePath: string;
  private files: string[];

  public constructor(pattern: string, ignorePath: string = undefined) {
    this.pattern = pattern;
    this.ignorePath = ignorePath;
    if (!this.ignorePath && fs.existsSync(this.defaultIgnoreFile)) {
      this.ignorePath = this.defaultIgnoreFile;
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
  }

  private ValidateIgnoreFile(): void {
    if (this.ignorePath !== undefined && !fs.existsSync(this.ignorePath)) {
      throw new Error(
        chalk.red(`Ignore path '${this.ignorePath}' doesn't exist.`)
      );
    }
  }

  public Files(): string[] {
    this.files = glob.sync(this.pattern);

    if (this.ignorePath !== undefined) {
      this.files = ignore()
        .add(fs.readFileSync(this.ignorePath).toString())
        .filter(this.files);
    }

    const prefix = process.cwd();
    this.files = this.files.map((file): string => {
      return path.join(prefix, file);
    });

    return this.files;
  }

  public IgnorePath(): string {
    return this.ignorePath;
  }
}
