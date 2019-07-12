import isGlob from 'is-glob';

export class Glob {
  private pattern: string;
  private ignore: string[];

  public constructor(pattern: string, ignore: string[]) {
    this.pattern = pattern;
    this.ignore = ignore;

    this.ValidatePattern();
  }

  private ValidatePattern(): void {
    if (this.pattern !== undefined && !isGlob(this.pattern)) {
      throw new Error(`'${this.pattern}' is not a valid glob pattern.`);
    }
  }
}
