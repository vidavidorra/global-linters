import { GLError } from '.';
import glob from 'glob';
import isGlob from 'is-glob';

export class Glob {
  private pattern: string;
  private files: string[];

  public constructor(pattern: string) {
    this.pattern = pattern;
  }

  public IsValid(): boolean {
    return this.pattern !== undefined && isGlob(this.pattern);
  }

  public Files(): string[] {
    if (!this.IsValid()) {
      throw new GLError(`'${this.pattern}' is not a valid glob pattern.`);
    }

    if (!this.files) {
      this.files = glob.sync(this.pattern);
    }

    return this.files;
  }
}
