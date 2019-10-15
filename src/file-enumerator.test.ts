import { FileEnumerator } from './file-enumerator';
import path from 'path';

describe('FileEnumerator', (): void => {
  const workingDirectory = process.cwd();
  const globPattern = '*.md';
  const filesFromGlobPattern = [
    path.join(workingDirectory, 'CHANGELOG.md'),
    path.join(workingDirectory, 'README.md'),
  ];
  const relativePath = './package.json';
  const filesFromRelativePath = [path.join(workingDirectory, relativePath)];
  const absolutePath = `${path.join(workingDirectory, '.gitignore')}`;

  test('Accepts a single glob pattern', (): void => {
    const fileEnumerator = new FileEnumerator([globPattern]);
    fileEnumerator.Files();
  });

  test('Accepts a single relative path', (): void => {
    const fileEnumerator = new FileEnumerator([relativePath]);
    fileEnumerator.Files();
  });

  test('Accepts a single absolute path', (): void => {
    const fileEnumerator = new FileEnumerator([absolutePath]);
    fileEnumerator.Files();
  });

  describe('Files()', (): void => {
    test('Throws if neither an existing file nor a valid glob was given', (): void => {
      const fileEnumerator = new FileEnumerator(['invalid']);

      expect((): void => {
        fileEnumerator.Files();
      }).toThrow(/is neither an existing file nor a valid glob pattern/i);
    });

    test('Returns an empty array for a glob pattern with no matches', (): void => {
      const fileEnumerator = new FileEnumerator(['*.not_existing']);
      const files = fileEnumerator.Files();
      expect(files).toEqual([]);
    });

    describe('Returns an array of files as absolute paths', (): void => {
      test('From only a glob pattern', (): void => {
        const fileEnumerator = new FileEnumerator([globPattern]);
        const files = fileEnumerator.Files();

        filesFromGlobPattern.forEach((file): void => {
          expect(files).toContain(file);
        });
        expect(files.length).toBeGreaterThanOrEqual(
          filesFromGlobPattern.length
        );
      });

      test('From only a relative path', (): void => {
        const fileEnumerator = new FileEnumerator([relativePath]);
        const files = fileEnumerator.Files();

        expect(files).toEqual(filesFromRelativePath);
        expect(files.length).toBe(filesFromRelativePath.length);
      });

      test('From only an absolute path', (): void => {
        const fileEnumerator = new FileEnumerator([absolutePath]);
        const files = fileEnumerator.Files();

        expect(files).toEqual([absolutePath]);
        expect(files.length).toBe(1);
      });

      test('From a combination of a glob pattern, relative and absolute path', (): void => {
        const filesAndGlob = [globPattern, relativePath, absolutePath];

        const fileEnumerator = new FileEnumerator(filesAndGlob);
        const files = fileEnumerator.Files();

        filesFromGlobPattern.forEach((file): void => {
          expect(files).toContain(file);
        });
        filesFromRelativePath.forEach((file): void => {
          expect(files).toContain(file);
        });
        expect(files).toContain(absolutePath);

        expect(files.length).toBeGreaterThanOrEqual(
          filesFromGlobPattern.length + filesFromRelativePath.length + 1
        );
      });

      test('When calling Files() multiple times', (): void => {
        const fileEnumerator = new FileEnumerator([relativePath]);
        const files1 = fileEnumerator.Files();
        const files2 = fileEnumerator.Files();

        expect(files1).toEqual(filesFromRelativePath);
        expect(files1.length).toBe(filesFromRelativePath.length);
        expect(files2).toEqual(filesFromRelativePath);
        expect(files2.length).toBe(filesFromRelativePath.length);
      });
    });
  });
});
