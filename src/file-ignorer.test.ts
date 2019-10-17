import { FileIgnorer } from '.';
import fs from 'fs';
import path from 'path';

describe('FileIgnorer', (): void => {
  let mockFs;
  beforeEach((): void => {
    mockFs = jest.spyOn(fs, 'existsSync').mockImplementation((): boolean => {
      return true;
    });
  });

  afterEach((): void => {
    mockFs.mockRestore();
  });

  test("Throws if the given ignore path doesn't exist", (): void => {
    mockFs = jest.spyOn(fs, 'existsSync').mockImplementation((): boolean => {
      return false;
    });

    expect((): void => {
      new FileIgnorer('non-existing');
    }).toThrow(/ignore path.*doesn't exist/i);
  });

  test("Throws if the default ignore path doesn't exist", (): void => {
    mockFs = jest.spyOn(fs, 'existsSync').mockImplementation((): boolean => {
      return false;
    });

    expect((): void => {
      new FileIgnorer();
    }).toThrow(/default ignore path.*doesn't exist/i);
  });

  test('Uses the default ignore path if no ignore path was given', (): void => {
    const fileIgnorer = new FileIgnorer();
    expect(fileIgnorer.IgnorePath()).toBe(fileIgnorer.DefaultIgnorePath());
  });

  test('Uses the given ignore path if it exists', (): void => {
    const ignorePath = 'my-ignore-path';
    const fileIgnorer = new FileIgnorer(ignorePath);
    expect(fileIgnorer.IgnorePath()).toBe(ignorePath);
  });

  describe('Filter()', (): void => {
    const workingDirectory = process.cwd();
    const testFiles = [
      'elephant.ts',
      'hedgehog.js',
      'insecta/butterfly.ts',
      'insecta/dragonfly.js',
      'insecta/honeybee.json',
      'reptilia/icarosaurus.js',
      'reptilia/iguana.ts',
      'reptilia/pogona-barbata.ts',
      'reptilia/turtle.ts',
    ].map((file): string => {
      return path.join(workingDirectory, 'test', file);
    });

    test('Removes files based on glob patterns described by the ignore path', (): void => {
      const ignorePath = 'test/.ignore';
      const fileIgnorer = new FileIgnorer(ignorePath);

      const expectedFiles = testFiles.filter((file): boolean => {
        return !file.endsWith('.js');
      });
      expect(fileIgnorer.Filter(testFiles)).toStrictEqual(expectedFiles);
    });
  });
});
