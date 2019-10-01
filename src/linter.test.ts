import * as ShellExec from './helpers/shell-exec';
import { Linter } from './linter';
import { Linters } from './linters';
import commandExists from 'command-exists';

jest.mock('./helpers/shell-exec');

describe('Linter', (): void => {
  const defaultLinterName = 'hadolint';
  const defaultLinterRange = '>1.0.0';

  test('Trows if the linter name is not supported.', (): void => {
    expect((): void => {
      new Linter('abccba', defaultLinterRange, null);
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

    test('Throws if the linter does not exist.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange, null);
      }).toThrow(/could not find executable/i);
    });
  });

  describe('Existing linter.', (): void => {
    let mockCommandExists;
    let mockShellExec;
    let mockConsoleLog;
    const mockedLinterName = 'mockedLinter';
    const results = [
      {
        line: 11,
        code: 'RULE#123',
        message: "Don't do that there",
        column: 1,
        file: '/home/thing/ubuntu1804.DockerFile',
        level: 'warning',
      },
      {
        line: 11,
        code: 'CD',
        message: 'Delete that before this.',
        column: 1,
        file: '/home/thing/ubuntu1804.DockerFile',
        level: 'info',
      },
      {
        line: 21,
        code: 123,
        message: 'Do this`',
        column: 12,
        file: '/home/thing/ubuntu1804.DockerFile',
        level: 'unknown_thing',
      },
      {
        line: 30,
        code: 'DD4566',
        message: 'This is not okay.',
        column: 1,
        file: '/home/thing/ubuntu1804.DockerFile',
        level: 'error',
      },
    ];

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

      mockConsoleLog = jest
        .spyOn(console, 'log')
        .mockImplementation((): void => {});

      Linters[mockedLinterName] = {
        versionOption: '--version',
        jsonFormat: {
          option: '--format=json',
          sinceVersion: '>=0.4.0',
        },
      };
    });

    afterEach((): void => {
      mockCommandExists.mockRestore();
      mockShellExec.mockRestore();
      mockConsoleLog.mockRestore();
      delete Linters[mockedLinterName];
    });

    test('Accepts a valid linter name.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange, null);
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
        new Linter(defaultLinterName, defaultLinterRange, null);
      }).toThrow(/could find version/i);
    });

    test('Accepts a valid range.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange, null);
      }).not.toThrow();
    });

    test('Throws if the range is invalid.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, 'this_is_no range', null);
      }).toThrow(/is not a valid semver range/i);
    });

    test('Throws if the range is not satified.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, '>=99.0.0', null);
      }).toThrow(/does not satisfy/i);
    });

    test('Throws when an expected Linters option is not configured.', (): void => {
      Linters[mockedLinterName] = {
        versionOption: '--version',
        jsonFormat: {
          option: '--format=json',
          sinceVersionUnknown: '>=99.4.0',
        },
      };

      expect((): void => {
        const l = new Linter(mockedLinterName, defaultLinterRange, null);
        l.LintFiles(['uno.x', 'dos.y']);
      }).toThrow(/option .* is not configured/i);
    });

    test('Runs linter with unformatted linter output if JSON not supported.', (): void => {
      Linters[mockedLinterName] = {
        versionOption: '--version',
        jsonFormat: {
          option: '--format=json',
          sinceVersion: '>=99.4.0',
        },
      };

      mockShellExec = jest
        .spyOn(ShellExec, 'ShellExec')
        .mockImplementationOnce(
          (): ShellExec.ShellExecResult => {
            const stdout = JSON.stringify(results);
            return { code: 0, stdout, stderr: null };
          }
        )
        .mockImplementationOnce(
          (): ShellExec.ShellExecResult => {
            return { code: 0, stdout: null, stderr: null };
          }
        );

      expect((): void => {
        const l = new Linter(mockedLinterName, defaultLinterRange, null);
        const result = l.LintFiles(['this_one.ext', 'other.ts']);
        expect(result.type).toBe('plain-text');
      }).not.toThrow();
    });

    test('Runs linter with formatted JSON linter output if supported.', (): void => {
      mockShellExec = jest
        .spyOn(ShellExec, 'ShellExec')
        .mockImplementationOnce(
          (): ShellExec.ShellExecResult => {
            const stdout = JSON.stringify(results);
            return { code: 0, stdout, stderr: null };
          }
        )
        .mockImplementationOnce(
          (): ShellExec.ShellExecResult => {
            return { code: 0, stdout: null, stderr: null };
          }
        );

      expect((): void => {
        const l = new Linter(mockedLinterName, defaultLinterRange, null);
        const result = l.LintFiles(['this_one.ext', 'other.ts']);
        expect(result.type).toBe('JSON');
      }).not.toThrow();
    });
  });
});
