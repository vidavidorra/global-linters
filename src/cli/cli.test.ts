import * as GlobalLinters from '../global-linters';
import { Cli } from './cli';

jest.mock('../global-linters');

describe('Cli', (): void => {
  let mockConsoleLog;
  let mockConsoleError;
  let mockExit;

  beforeEach((): void => {
    mockConsoleLog = jest
      .spyOn(console, 'log')
      .mockImplementation((): void => {});

    mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation((): void => {});

    /**
     * Ignore the following line because the mock implementation for
     * `process.exit` does not compy with the standard exit type of
     * `(code?: number) => never`. That is fine in this case since the program
     * shouldn't actually exit but just let the tests detect that it would
     * have.
     */
    // @ts-ignore
    mockExit = jest.spyOn(process, 'exit').mockImplementation((): void => {});
  });

  afterEach((): void => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockExit.mockRestore();
  });

  describe('Exits with error code and message.', (): void => {
    test('If no arguments are given.', (): void => {
      const cli = new Cli();
      cli.Parse([]);

      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
    });

    test('If the positional glob argument is not given.', (): void => {
      const cli = new Cli();
      cli.Parse(['hadolint']);

      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
    });

    test('If the positional linter argument is not in choices.', (): void => {
      const cli = new Cli();
      cli.Parse(['abcdef', '*']);

      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledTimes(1);
      expect(mockExit).not.toHaveBeenCalledWith(0);
    });
  });

  describe('Exits with success code and message.', (): void => {
    test.each(['--help', '-h', '--version', '-v'])(
      'If the `%s` arguments is given.',
      (args): void => {
        const cli = new Cli();
        let cliAruments = [];
        if (Array.isArray(args)) {
          cliAruments = args;
        } else {
          cliAruments.push(args);
        }
        cli.Parse(cliAruments);

        expect(mockConsoleLog).toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledTimes(1);
        expect(mockExit).toHaveBeenCalledWith(0);
      }
    );
  });

  describe('Accepts valid arguments.', (): void => {
    let cliArguments = [];
    beforeEach((): void => {
      cliArguments = ['hadolint', '*'];
    });

    afterEach((): void => {
      cliArguments = [];
    });

    test('If only the positonal arguments are given.', (): void => {
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
    ])('If the `%s` argument is given.', (args): void => {
      cliArguments.concat(args);

      const cli = new Cli();
      cli.Parse(cliArguments);

      expect(mockConsoleError).not.toHaveBeenCalled();
      expect(mockExit).not.toHaveBeenCalled();
    });

    test('If all argumenta are given.', (): void => {
      cliArguments.concat([
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
      .mockImplementation((): void => {});

    const cli = new Cli();
    cli.Run(['hadolint', '*']);

    expect(mockGlobalLinters).toBeCalledTimes(1);
    expect(mockConsoleError).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });
});
