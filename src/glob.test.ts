import { Glob } from './glob';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

jest.mock('fs');
jest.mock('glob');

describe('Glob', (): void => {
  let mockFsExistsSync;
  let mockFsReadFileSync;

  const defaultPattern = '**/*.ts';

  beforeEach((): void => {
    mockFsExistsSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((): boolean => {
        return true;
      });

    mockFsReadFileSync = jest.spyOn(fs, 'readFileSync');
  });

  afterEach((): void => {
    mockFsExistsSync.mockRestore();
    mockFsReadFileSync.mockRestore();
  });

  test('Throws if an invalid glob pattern is given', (): void => {
    expect((): void => {
      new Glob('a');
    }).toThrow(/is not a valid glob pattern/i);
  });

  test('Validates a valid glob pattern', (): void => {
    expect((): void => {
      new Glob(defaultPattern);
    }).not.toThrow();
  });

  test('Uses the default ignore path if none is given and the default exists', (): void => {
    const g = new Glob(defaultPattern);
    expect(g.IgnorePath()).toBe('.prettierignore');
  });

  test('Uses no ignore path if none is given and the default does not exist', (): void => {
    mockFsExistsSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((): boolean => {
        return false;
      });
    const g = new Glob(defaultPattern);
    expect(g.IgnorePath()).toBeUndefined();
  });

  test('Uses the given ignore path if it exists', (): void => {
    const ignoreFile = '.ignorefile';
    const g = new Glob(defaultPattern, ignoreFile);
    expect(g.IgnorePath()).toBe(ignoreFile);
  });

  test('Throws if the given ignore path is non-existing', (): void => {
    mockFsExistsSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((): boolean => {
        return false;
      });
    expect((): void => {
      new Glob('*', 'somerandomfile');
    }).toThrow(/ignore path .* doesn't exist/i);
  });

  describe('Files', (): void => {
    const defaultInputFiles = [
      'test/stuff.ts',
      'test/butterfly.ts',
      'cat.ts',
      'duck.js',
      'frog',
    ];

    let mockGlob;

    beforeEach((): void => {
      mockGlob = jest
        .spyOn(glob, 'sync')
        .mockImplementationOnce((): string[] => {
          return defaultInputFiles;
        });
    });

    afterEach((): void => {
      mockGlob.mockRestore();
    });

    const pathPrefix = process.cwd();

    const defaultInputFilesWithPrefix = defaultInputFiles.map(
      (file): string => {
        return path.join(pathPrefix, file);
      }
    );

    test('Are not filtered if no ignore path is given and the default path does not exist', (): void => {
      mockFsExistsSync = jest
        .spyOn(fs, 'existsSync')
        .mockImplementation((): boolean => {
          return false;
        });

      const g = new Glob('*');
      expect(g.Files()).toStrictEqual(defaultInputFilesWithPrefix);
    });

    test('Are filtered using the default ignorepath if it exists', (): void => {
      mockFsReadFileSync = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce(
          (): Buffer => {
            return Buffer.from('**/*.js\n', 'utf8');
          }
        );

      const expectedFiles = defaultInputFilesWithPrefix.filter((e): boolean => {
        return !e.endsWith('.js');
      });

      const g = new Glob('*', '.ignorefile');
      expect(g.Files()).toStrictEqual(expectedFiles);
    });
  });
});
