import { GLError } from '.';
import fs from 'fs';
import ignore from 'ignore';
import path from 'path';

export class FileIgnorer {
  private readonly defaultIgnorePath = '.prettierignore';
  private ignorePath: string;
  private workingDirectory: string;

  public constructor(ignorePath: string = undefined) {
    this.ignorePath = ignorePath;
    this.SetIgnorePath();
  }

  private SetIgnorePath(): void {
    if (this.ignorePath !== undefined && !fs.existsSync(this.ignorePath)) {
      throw new GLError(`Ignore path '${this.ignorePath}' doesn't exist.`);
    } else if (this.ignorePath === undefined) {
      if (fs.existsSync(this.defaultIgnorePath)) {
        this.ignorePath = this.defaultIgnorePath;
      } else {
        throw new GLError(
          `Default ignore path '${this.defaultIgnorePath}' doesn't exist.`
        );
      }
    }
  }

  private WorkingDirectory(): string {
    if (!this.workingDirectory) {
      this.workingDirectory = process.cwd();
    }

    return this.workingDirectory;
  }

  private ReadIgnoreFile(): string {
    return fs.readFileSync(this.ignorePath).toString();
  }

  public DefaultIgnorePath(): string {
    return this.defaultIgnorePath;
  }

  public IgnorePath(): string {
    return this.ignorePath;
  }

  public Filter(files: string[]): string[] {
    const relativeFiles = files.map((file): string => {
      return path.relative(this.WorkingDirectory(), file);
    });

    const filteredFiles = ignore()
      .add(this.ReadIgnoreFile())
      .filter(relativeFiles);

    const absoluteFilteredFiles = filteredFiles.map((file): string => {
      return path.resolve(this.WorkingDirectory(), file);
    });

    return absoluteFilteredFiles;
  }
}
