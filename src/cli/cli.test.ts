import * as GlobalLinters from '../global-linters';
import { Cli } from '.';
import { GLError } from '../helpers';
import { Result } from '..';

jest.mock('../global-linters');

describe('Cli', (): void => {
  let consoleLog;
  let mockConsoleLog;
  let consoleError;
  let mockConsoleError;
  let mockExit;
  const defaultLinter = 'hadolint';
  const defaultFileAndOrGlob = '*';

  let result;
  beforeEach((): void => {
    consoleLog = '';
    mockConsoleLog = jest
      .spyOn(console, 'log')
      .mockImplementation((msg: string): void => {
        consoleLog += msg;
      });

    consoleError = '';
    mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation((msg: string): void => {
        consoleError += msg;
      });

    /**
     * Ignore the following line because the mock implementation for
     * `process.exit` does not comply with the standard exit type of
     * `(code?: number) => never`. That is fine in this case since the program
     * shouldn't actually exit but just let the tests detect that it would have.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: TS2534: A function returning 'never' cannot have a reachable end point.
    mockExit = jest.spyOn(process, 'exit').mockImplementation((): never => {});

    result = {
      type: 'JSON',
      results: [],
      summary: {
        count: {
          error: 0,
          warning: 0,
          info: 0,
          other: 0,
        },
      },
    };
  });

  afterEach((): void => {
    mockConsoleLog.mockRestore();
    consoleLog = '';
    mockConsoleError.mockRestore();
    consoleError = '';
    mockExit.mockRestore();
    result = {};
  });

  describe('Argument parser exits with error code and message', (): void => {
    test('If no arguments and options are given', (): void => {
      const cli = new Cli();
      cli.Parse([]);

      expect(mockConsoleError).toHaveBeenCalled();
      expect(consoleError).not.toBe('');
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
    });

    test.each([['linter', defaultLinter], ['glob', defaultFileAndOrGlob]])(
      'If only the positional %s argument is given',
      (name, args): void => {
        const cli = new Cli();
        cli.Parse([args]);

        expect(mockConsoleError).toHaveBeenCalled();
        expect(consoleError).not.toBe('');
        expect(mockExit).toHaveBeenCalledTimes(1);
        expect(mockExit).not.toHaveBeenCalledWith(0);
      }
    );

    test('If the positional linter argument is not in choices', (): void => {
      const cli = new Cli();
      cli.Parse(['abcdef', defaultFileAndOrGlob]);

      expect(mockConsoleError).toHaveBeenCalled();
      expect(consoleError).not.toBe('');
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
    });
  });

  describe('Argument parser exits with success code (and message)', (): void => {
    let cliArguments = [];
    beforeEach((): void => {
      cliArguments = [defaultLinter, defaultFileAndOrGlob];
    });

    afterEach((): void => {
      cliArguments = [];
    });

    test.each(['--help', '-h', '--version', '-v'])(
      'If only the `%s` option is given',
      (args): void => {
        const cli = new Cli();
        cli.Parse([args]);

        expect(mockConsoleLog).toHaveBeenCalled();
        expect(consoleLog).not.toBe('');
        expect(mockConsoleError).not.toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledTimes(1);
        expect(mockExit).toHaveBeenCalledWith(0);
      }
    );

    test('If only the positional arguments are given', (): void => {
      const cli = new Cli();
      cli.Parse(cliArguments);

      expect(mockConsoleError).not.toHaveBeenCalled();
      expect(mockExit).not.toHaveBeenCalled();
    });

    test.each([
      ['--range', '>1.0.0'],
      ['-r', '>1.0.0'],
      ['--ignorePath', '.my_ignorefile'],
      ['--noIgnore', 'true'],
      ['-i', '.my_ignorefile'],
      ['--options', '"--thing -vv -a=yes -e this"'],
    ])(
      'If the positional arguments and the `%s` option are given',
      (option, value): void => {
        cliArguments = cliArguments.concat([option, value]);

        const cli = new Cli();
        cli.Parse(cliArguments);

        expect(mockConsoleError).not.toHaveBeenCalled();
        expect(mockExit).not.toHaveBeenCalled();
      }
    );

    test('If all arguments are given (without conflicting ones)', (): void => {
      cliArguments = cliArguments.concat([
        '--options',
        '"--thing -vv -a=yes -e this"',
        '--ignorePath',
        '.my_ignorefile',
        '--range',
        '>22.0.1',
      ]);

      const cli = new Cli();
      cli.Parse(cliArguments);

      expect(mockConsoleError).not.toHaveBeenCalled();
      expect(mockExit).not.toHaveBeenCalled();
    });
  });

  test('Runs GlobalLinters', (): void => {
    result.summary.count.error = 1;
    const mockGlobalLinters = jest
      .spyOn(GlobalLinters, 'GlobalLinters')
      .mockImplementation(
        (): Result => {
          return result;
        }
      );

    const cli = new Cli();
    cli.Run([defaultLinter, defaultFileAndOrGlob]);

    expect(mockGlobalLinters).toBeCalledTimes(1);
    expect(mockConsoleError).not.toHaveBeenCalled();
    mockGlobalLinters.mockRestore();
  });

  describe('Exits after running the linter', (): void => {
    let mockGlobalLinters;
    let cliArguments = [];
    beforeEach((): void => {
      mockGlobalLinters = jest
        .spyOn(GlobalLinters, 'GlobalLinters')
        .mockImplementation(
          (): Result => {
            return result;
          }
        );

      cliArguments = [defaultLinter, defaultFileAndOrGlob];
    });

    afterEach((): void => {
      mockGlobalLinters.mockRestore();
      cliArguments = [];
    });

    test('With code 0 on success', (): void => {
      const cli = new Cli();
      cli.Run(cliArguments);

      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    test('With non-zero on lint error', (): void => {
      result.summary.count.error = 1;
      mockGlobalLinters = jest
        .spyOn(GlobalLinters, 'GlobalLinters')
        .mockImplementationOnce(
          (): Result => {
            return result;
          }
        );

      const cli = new Cli();
      cli.Run(cliArguments);

      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
      mockGlobalLinters.mockRestore();
    });

    test('With non-zero on thrown GLError', (): void => {
      const mockGlobalLinters = jest
        .spyOn(GlobalLinters, 'GlobalLinters')
        .mockImplementationOnce(
          (): Result => {
            throw new GLError('Fault');
          }
        );

      const cli = new Cli();
      cli.Run(cliArguments);
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
      mockGlobalLinters.mockRestore();
    });

    test('With non-zero on thrown Error', (): void => {
      const mockGlobalLinters = jest
        .spyOn(GlobalLinters, 'GlobalLinters')
        .mockImplementationOnce(
          (): Result => {
            throw new Error('Fault');
          }
        );

      const cli = new Cli();
      cli.Run(cliArguments);
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
      mockGlobalLinters.mockRestore();
    });
  });
});
