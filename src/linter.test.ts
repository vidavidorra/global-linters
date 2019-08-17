import { Linter } from './linter';
import commandExists from 'command-exists';

describe('Linter', (): void => {
  const defaultLinterName = 'hadolint';
  const defaultLinterRange = '>1.0.0';

  describe('With non-exixting linter.', (): void => {
    let mockCommandExists;
    beforeEach((): void => {
      mockCommandExists = jest
        .spyOn(commandExists, 'sync')
        .mockImplementation((): boolean => {
          return false;
        });
    });

    afterEach((): void => {
      mockCommandExists.mockRestore();
    });

    test('Trows if the passed linter name does not exist.', (): void => {
      expect((): void => {
        const linter = new Linter(defaultLinterName, defaultLinterRange);
        expect(linter.Name() === defaultLinterName);
      }).toThrow(/could not find executable/i);
    });
  });

  describe.skip('With existing linter.', (): void => {
    let mockCommandExists;
    beforeEach((): void => {
      mockCommandExists = jest
        .spyOn(commandExists, 'sync')
        .mockImplementation((): boolean => {
          return true;
        });
    });

    afterEach((): void => {
      mockCommandExists.mockRestore();
    });

    test('Accepts a valid linter name.', (): void => {
      /**
       * Mock `shell.exec` to return
       * 'ShellCheck - shell script analysis tool\n' +
       * 'version: 1.1.1\n' +
       * 'license: GNU General Public License, version 3\n' +
       * 'website: https://www.shellcheck.net';
       */
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange);
      }).not.toThrow();
    });

    test('Accepts a valid range.', (): void => {
      /**
       * Mock `shell.exec` to return
       * 'ShellCheck - shell script analysis tool\n' +
       * 'version: 1.1.1\n' +
       * 'license: GNU General Public License, version 3\n' +
       * 'website: https://www.shellcheck.net';
       */
      expect((): void => {
        new Linter(defaultLinterName, defaultLinterRange);
      }).not.toThrow();
    });

    test('Throws if range is not satified.', (): void => {
      expect((): void => {
        new Linter(defaultLinterName, '>=99.0.0');
      }).toThrow(/does not satisfy/i);
    });
  });
});
