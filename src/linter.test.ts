import * as ShellExec from './helpers/shell-exec';
import { Linter } from './linter';
import commandExists from 'command-exists';

jest.mock('./helpers/shell-exec');

describe('Linter', (): void => {
  const defaultLinterName = 'hadolint';
  const defaultLinterRange = '>1.0.0';

  test('Trows if the linter name is not supported.', (): void => {
    expect((): void => {
      new Linter('abccba', defaultLinterRange);
    }).toThrow(/linter .* is not supported/i);
  });

  describe('Non-exixting linter.', (): void => {
    let mockCommandExists;
    beforeEach((): void => {
      mockCommandExists = jest
        .spyOn(commandExists, 'sync')
        .mockImplementationOnce((): boolean => {
          return false;
        });
    });

    afterEach((): void => {
      mockCommandExists.mockRestore();
    });

    test('Trows if the linter name does not exist.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange);
      }).toThrow(/could not find executable/i);
    });
  });

  describe('Existing linter.', (): void => {
    let mockCommandExists;
    let mockShellExec;

    beforeEach((): void => {
      mockCommandExists = jest
        .spyOn(commandExists, 'sync')
        .mockImplementationOnce((): boolean => {
          return true;
        });

      mockShellExec = jest.spyOn(ShellExec, 'ShellExec').mockImplementationOnce(
        (): ShellExec.ShellExecResult => {
          return { code: 0, stdout: 'version: 1.1.1\n', stderr: null };
        }
      );
    });

    afterEach((): void => {
      mockCommandExists.mockRestore();
      mockShellExec.mockRestore();
    });

    test('Accepts a valid linter name.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange);
      }).not.toThrow();
    });

    test('Throws if no version could be coerced.', (): void => {
      mockShellExec.mockRestore();
      mockShellExec = jest.spyOn(ShellExec, 'ShellExec').mockImplementationOnce(
        (): ShellExec.ShellExecResult => {
          return { code: 0, stdout: 'no version here!\n', stderr: null };
        }
      );

      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange);
      }).toThrow(/could find version/i);
    });

    test('Accepts a valid range.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange);
      }).not.toThrow();
    });

    test('Throws if the range is invalid.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, 'this_is_no range');
      }).toThrow(/is not a valid semver range/i);
    });

    test('Throws if the range is not satified.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, '>=99.0.0');
      }).toThrow(/does not satisfy/i);
    });
  });
});
