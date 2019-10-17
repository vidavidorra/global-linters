import { Glob } from '.';
import glob from 'glob';

jest.mock('glob');

describe('Glob', (): void => {
  const validPattern = '**/*.ts';
  const invalidPattern = 'invalid';

  describe('IsValid() returns', (): void => {
    test('True for a valid pattern', (): void => {
      const glob = new Glob(validPattern);
      expect(glob.IsValid()).toBe(true);
    });

    test('False for an invalid pattern', (): void => {
      const glob = new Glob(invalidPattern);
      expect(glob.IsValid()).toBe(false);
    });
  });

  describe('Files()', (): void => {
    const defaultInputFiles = [
      'reptilia/iguana.ts',
      'insecta/butterfly.ts',
      'elephant.ts',
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

    test('Throws if the pattern is invalid', (): void => {
      const glob = new Glob(invalidPattern);

      expect((): void => {
        glob.Files();
      }).toThrow(/is not a valid glob pattern/i);
    });

    test('Returns a list of files', (): void => {
      const glob = new Glob(validPattern);
      expect(glob.Files()).toBe(defaultInputFiles);
      expect(mockGlob).toBeCalledTimes(1);
    });

    test('Caches files when called multiple times', (): void => {
      const glob = new Glob(validPattern);
      const files1 = glob.Files();
      const files2 = glob.Files();
      expect(files1).toBe(defaultInputFiles);
      expect(files2).toBe(defaultInputFiles);
      expect(mockGlob).toBeCalledTimes(1);
    });
  });
});
