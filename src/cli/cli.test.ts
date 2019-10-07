import * as GlobalLinters from '../global-linters';
import { Cli } from '.';
import { Result } from '..';

jest.mock('../global-linters');

describe('Cli', (): void => {
  let consoleLog;
  let mockConsoleLog;
  let consoleError;
  let mockConsoleError;
  let mockExit;
  const defaultLinter = 'hadolint';
  const defaultGlob = '*';

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
  });

  afterEach((): void => {
    mockConsoleLog.mockRestore();
    consoleLog = '';
    mockConsoleError.mockRestore();
    consoleError = '';
    mockExit.mockRestore();
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

    test.each([['linter', defaultLinter], ['glob', defaultGlob]])(
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
      cli.Parse(['abcdef', defaultGlob]);

      expect(mockConsoleError).toHaveBeenCalled();
      expect(consoleError).not.toBe('');
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
    });
  });

  describe('Argument parser exits with success code (and message)', (): void => {
    let cliArguments = [];
    beforeEach((): void => {
      cliArguments = [defaultLinter, defaultGlob];
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
      ['-i', '.my_ignorefile'],
      ['--options', "'--thing -vv -a=yes -e this'"],
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

    test('If all argumenta are given.', (): void => {
      cliArguments = cliArguments.concat([
        '--options',
        "'--thing -vv -a=yes -e this'",
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

  test('Runs GlobalLinters.', (): void => {
    const mockGlobalLinters = jest
      .spyOn(GlobalLinters, 'GlobalLinters')
      .mockImplementation(
        (): Result => {
          return {
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
        }
      );

    const cli = new Cli();
    cli.Run([defaultLinter, defaultGlob]);

    expect(mockGlobalLinters).toBeCalledTimes(1);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
