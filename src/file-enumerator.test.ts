import { FileEnumerator } from '.';
import path from 'path';

describe('FileEnumerator', (): void => {
  const workingDirectory = process.cwd();
  const globPattern = 'test/**/*.{js,ts}';
  const filesFromGlobPattern = [
    'elephant.ts',
    'hedgehog.js',
    'insecta/butterfly.ts',
    'insecta/dragonfly.js',
    'reptilia/icarosaurus.js',
    'reptilia/iguana.ts',
    'reptilia/turtle.ts',
  ].map((file): string => {
    return path.join(workingDirectory, 'test', file);
  });

  const relativePath = 'test/insecta/honeybee.json';
  const filesFromRelativePath = [path.join(workingDirectory, relativePath)];
  const absolutePath = path.join(
    workingDirectory,
    'test/reptilia/pogona-barbata.json'
  );

  test('Accepts a single glob pattern', (): void => {
    const fileEnumerator = new FileEnumerator([globPattern], false);
    fileEnumerator.Files();
  });

  test('Accepts a single relative path', (): void => {
    const fileEnumerator = new FileEnumerator([relativePath], false);
    fileEnumerator.Files();
  });

  test('Accepts a single absolute path', (): void => {
    const fileEnumerator = new FileEnumerator([absolutePath], false);
    fileEnumerator.Files();
  });

  describe('Files()', (): void => {
    test('Throws if neither an existing file nor a valid glob was given', (): void => {
      const fileEnumerator = new FileEnumerator(['invalid'], false);

      expect((): void => {
        fileEnumerator.Files();
      }).toThrow(/is neither an existing file nor a valid glob pattern/i);
    });

    test('Returns an empty array for a glob pattern with no matches', (): void => {
      const fileEnumerator = new FileEnumerator(['*.not_existing'], false);
      const files = fileEnumerator.Files();
      expect(files).toEqual([]);
    });

    describe('Returns an array of files as absolute paths', (): void => {
      test('From only a glob pattern', (): void => {
        const fileEnumerator = new FileEnumerator([globPattern], false);
        const files = fileEnumerator.Files();

        filesFromGlobPattern.forEach((file): void => {
          expect(files).toContain(file);
        });
        expect(files.length).toBeGreaterThanOrEqual(
          filesFromGlobPattern.length
        );
      });

      test('From only a relative path', (): void => {
        const fileEnumerator = new FileEnumerator([relativePath], false);
        const files = fileEnumerator.Files();

        expect(files).toEqual(filesFromRelativePath);
        expect(files).toHaveLength(filesFromRelativePath.length);
      });

      test('From only an absolute path', (): void => {
        const fileEnumerator = new FileEnumerator([absolutePath], false);
        const files = fileEnumerator.Files();

        expect(files).toEqual([absolutePath]);
        expect(files).toHaveLength(1);
      });

      test('From a combination of a glob pattern, relative and absolute path', (): void => {
        const filesAndGlob = [globPattern, relativePath, absolutePath];
        const fileEnumerator = new FileEnumerator(filesAndGlob, false);
        const files = fileEnumerator.Files();

        filesFromGlobPattern
          .concat(filesFromRelativePath)
          .forEach((file): void => {
            expect(files).toContain(file);
          });
        expect(files).toContain(absolutePath);
        expect(files).toHaveLength(
          filesFromGlobPattern.length + filesFromRelativePath.length + 1
        );
      });

      test('When calling Files() multiple times', (): void => {
        const fileEnumerator = new FileEnumerator([relativePath], false);
        const files1 = fileEnumerator.Files();
        const files2 = fileEnumerator.Files();

        expect(files1).toEqual(filesFromRelativePath);
        expect(files1).toHaveLength(filesFromRelativePath.length);
        expect(files2).toEqual(filesFromRelativePath);
        expect(files2).toHaveLength(filesFromRelativePath.length);
      });

      test('Without files ignored based on glob patterns described by the ignore path', (): void => {
        const fileEnumerator = new FileEnumerator(
          [globPattern],
          false,
          'test/.ignore'
        );
        const expectedFiles = filesFromGlobPattern.filter((file): boolean => {
          return !file.endsWith('.js');
        });
        const files = fileEnumerator.Files();

        expect(files).toEqual(expectedFiles);
        expect(files).toHaveLength(expectedFiles.length);
      });

      test('Without ignoring files if the noIgnore argument was given', (): void => {
        const fileEnumerator = new FileEnumerator(
          [globPattern],
          true,
          'test/.ignore'
        );
        const files = fileEnumerator.Files();

        expect(files).toEqual(filesFromGlobPattern);
        expect(files).toHaveLength(filesFromGlobPattern.length);
      });
    });
  });
});
