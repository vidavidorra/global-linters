import { FileIgnorer, GLError, Glob } from '.';
import fs from 'fs';
import path from 'path';

export class FileEnumerator {
  private fileAndOrGlob: string[];
  private files: string[];
  private workingDirectory: string;
  private ignorePath;
  private fileIgnorer: FileIgnorer;

  public constructor(fileAndOrGlob: string[], ignorePath: string = undefined) {
    this.fileAndOrGlob = fileAndOrGlob;
    this.ignorePath = ignorePath;
  }

  private WorkingDirectory(): string {
    if (!this.workingDirectory) {
      this.workingDirectory = process.cwd();
    }

    return this.workingDirectory;
  }

  private ResolveFilePath(filePath: string): string {
    return path.resolve(this.WorkingDirectory(), filePath);
  }

  private AddFiles(file: string[]): void {
    file.forEach((e): void => {
      this.files.push(this.ResolveFilePath(e));
    });
  }

  private RemoveDuplicates(): void {
    this.files = Array.from(new Set(this.files));
  }

  private IgnoreFiles(): void {
    this.files = this.fileIgnorer.Filter(this.files);
  }

  public Files(): string[] {
    if (!this.files) {
      this.fileIgnorer = new FileIgnorer(this.ignorePath);

      this.files = [];
      this.fileAndOrGlob.forEach((e: string): void => {
        const glob = new Glob(e);
        if (glob.IsValid()) {
          this.AddFiles(glob.Files());
        } else if (fs.existsSync(e)) {
          this.AddFiles([e]);
        } else {
          throw new GLError(
            `'${e}' is neither an existing file nor a valid glob pattern.`
          );
        }
      });

      this.RemoveDuplicates();
      this.IgnoreFiles();
    }

    return this.files;
  }
}
