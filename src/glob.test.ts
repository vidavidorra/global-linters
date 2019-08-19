import { Glob } from './glob';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;
jest.mock('glob');
const mockedGlob = glob as jest.Mocked<typeof glob>;

describe('Glob', (): void => {
  describe('ignore path', (): void => {
    test('Uses the default ignore path if none is given and the default path exists.', (): void => {
      mockedFs.existsSync.mockReturnValue(true);
      const g = new Glob('*');
      expect(g.IgnorePath()).toBe('.prettierignore');
    });

    test('Does not use a ignore path if none is given and the default path does not exist.', (): void => {
      mockedFs.existsSync.mockReturnValue(false);
      const g = new Glob('*');
      expect(g.IgnorePath()).toBeUndefined();
    });

    test('Uses the given ignore path if it exists.', (): void => {
      mockedFs.existsSync.mockReturnValue(true);
      const ignoreFile = '.ignorefile';
      const g = new Glob('*', ignoreFile);
      expect(g.IgnorePath()).toBe(ignoreFile);
    });

    test('Throws if a non-existing ignore path is given.', (): void => {
      mockedFs.existsSync.mockReturnValue(false);
      expect((): void => {
        new Glob('*', 'somerandomfile');
      }).toThrow(/ignore path .* doesn't exist/i);
    });
  });

  describe('pattern', (): void => {
    test('Validates a valid glob pattern.', (): void => {
      const pattern = '**/*.ts';
      const g = new Glob(pattern);
      expect(g.Pattern()).toBe(pattern);
    });

    test('Throws if an invalid glob pattern is given.', (): void => {
      expect((): void => {
        new Glob('a');
      }).toThrow(/is not a valid glob pattern/i);
    });
  });

  describe('files', (): void => {
    const pathPrefix = process.cwd();
    const defaultInputFiles = [
      'test/stuff.ts',
      'test/butterfly.ts',
      'cat.ts',
      'duck.js',
      'frog',
    ];
    const defaultInputFilesWithPrefix = defaultInputFiles.map(
      (file): string => {
        return path.join(pathPrefix, file);
      }
    );

    test('Are not filtered if no ignore path is given and the default does not exist.', (): void => {
      mockedFs.existsSync.mockReturnValue(false);
      mockedGlob.sync.mockReturnValue(defaultInputFiles);

      const g = new Glob('*');
      expect(g.Files()).toStrictEqual(defaultInputFilesWithPrefix);
    });

    test('Are filtered using the default ignorepath if it exists.', (): void => {
      const expectedFiles = defaultInputFilesWithPrefix.filter((e): boolean => {
        return !e.endsWith('.js');
      });

      mockedFs.existsSync.mockReturnValue(true);
      mockedGlob.sync.mockReturnValue(defaultInputFiles);
      mockedFs.readFileSync.mockReturnValue(Buffer.from('**/*.js\n', 'utf8'));

      const g = new Glob('*', '.ignorefile');
      expect(g.Files()).toStrictEqual(expectedFiles);
    });
  });
});
