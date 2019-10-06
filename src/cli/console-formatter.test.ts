import { ConsoleFormatter } from './console-formatter';
import { Result } from '..';

describe('Console', (): void => {
  let consoleLog;
  let mockConsoleLog;
  let mockConsoleError;

  beforeEach((): void => {
    consoleLog = '';
    mockConsoleLog = jest
      .spyOn(console, 'log')
      .mockImplementation((msg: string): void => {
        consoleLog += msg;
      });

    mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation((): void => {});
  });

  afterEach((): void => {
    mockConsoleLog.mockRestore();
    consoleLog = '';
    mockConsoleError.mockRestore();
  });

  test('Prints plain text result to console', (): void => {
    const result: Result = {
      type: 'plain-text',
      results: [
        {
          message: '/home/file1.test:11 RULE#1 Play laser tag once a week.',
          file: '/home/file1.test',
        },
        {
          message:
            '/home/file1.test:30 2 Tip generously. We ALL have to make up for Ted.',
          file: '/home/file1.test',
        },
        {
          message: '/home/file2:21 3 Don’t get married before you’re thirty.',
          file: '/home/file2',
        },
        {
          message:
            '/home/THE AWESOME RULES.that:23 23 Never use the word “moist” on a first date.',
          file: '/home/THE AWESOME RULES.that',
        },
        {
          message:
            '/home/THE AWESOME RULES.that:30 15 Give at least as many high fives as you get.',
          file: '/home/THE AWESOME RULES.that',
        },
      ],
      summary: {
        count: {
          error: 0,
          warning: 0,
          info: 0,
          other: 0,
        },
      },
    };

    ConsoleFormatter(result);

    expect(mockConsoleLog).toHaveBeenCalled();
    result.results.forEach((e): void => {
      expect(consoleLog).toContain(e.message);
      expect(consoleLog).toContain(e.file);
    });
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  describe('JSON result prints to console', (): void => {
    test('Without summary if there are no warnings or errors', (): void => {
      const result: Result = {
        type: 'JSON',
        results: [
          {
            line: 11,
            code: 'RULE#1',
            message: 'Play laser tag once a week.',
            column: 1,
            file: '/home/file1.test',
            level: 'info',
          },
          {
            line: 30,
            code: '2',
            message: 'Tip generously. We ALL have to make up for Ted.',
            column: 1,
            file: '/home/file1.test',
            level: 'info',
          },
          {
            line: 21,
            code: '3',
            message: 'Don’t get married before you’re thirty.',
            column: 12,
            file: '/home/file2',
            level: 'unknown_thing',
          },
          {
            line: 23,
            code: '23',
            message: 'Never use the word “moist” on a first date.',
            column: 12,
            file: '/home/THE AWESOME RULES.that',
            level: 'info',
          },
          {
            line: 30,
            code: '15',
            message: 'Give at least as many high fives as you get.',
            column: 1,
            file: '/home/THE AWESOME RULES.that',
            level: 'info',
          },
        ],
        summary: {
          count: {
            error: 0,
            warning: 0,
            info: 4,
            other: 1,
          },
        },
      };

      ConsoleFormatter(result);

      expect(mockConsoleLog).toHaveBeenCalled();
      result.results.forEach((e): void => {
        expect(consoleLog).toContain(e.message);
        expect(consoleLog).toContain(e.file);
        expect(consoleLog).toContain(e.line);
        expect(consoleLog).toContain(e.column);
        expect(consoleLog).toContain(e.level);
        expect(consoleLog).toContain(e.code);
      });
      expect(consoleLog).not.toContain('problems');
      expect(consoleLog).not.toContain('error');
      expect(consoleLog).not.toContain('warning');
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    test('With error summary if there are errors and warnings', (): void => {
      const result: Result = {
        type: 'JSON',
        results: [
          {
            line: 11,
            code: 'RULE#1',
            message: 'Play laser tag once a week.',
            column: 1,
            file: '/home/file1.test',
            level: 'warning',
          },
          {
            line: 30,
            code: '2',
            message: 'Tip generously. We ALL have to make up for Ted.',
            column: 1,
            file: '/home/file1.test',
            level: 'error',
          },
          {
            line: 21,
            code: '3',
            message: 'Don’t get married before you’re thirty.',
            column: 12,
            file: '/home/file2',
            level: 'unknown_thing',
          },
          {
            line: 23,
            code: '23',
            message: 'Never use the word “moist” on a first date.',
            column: 12,
            file: '/home/THE AWESOME RULES.that',
            level: 'info',
          },
          {
            line: 30,
            code: '15',
            message: 'Give at least as many high fives as you get.',
            column: 1,
            file: '/home/THE AWESOME RULES.that',
            level: 'error',
          },
        ],
        summary: {
          count: {
            error: 2,
            warning: 1,
            info: 1,
            other: 1,
          },
        },
      };

      ConsoleFormatter(result);

      expect(mockConsoleLog).toHaveBeenCalled();
      result.results.forEach((e): void => {
        expect(consoleLog).toContain(e.message);
        expect(consoleLog).toContain(e.file);
        expect(consoleLog).toContain(e.line);
        expect(consoleLog).toContain(e.column);
        expect(consoleLog).toContain(e.level);
        expect(consoleLog).toContain(e.code);
      });
      expect(consoleLog).toContain('problems');
      expect(consoleLog).toContain('2 errors');
      expect(consoleLog).toContain('1 warning');
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    test('With error summary if there are errors', (): void => {
      const result: Result = {
        type: 'JSON',
        results: [
          {
            line: 11,
            code: 'RULE#1',
            message: 'Play laser tag once a week.',
            column: 1,
            file: '/home/file1.test',
            level: 'error',
          },
          {
            line: 30,
            code: '2',
            message: 'Tip generously. We ALL have to make up for Ted.',
            column: 1,
            file: '/home/file1.test',
            level: 'error',
          },
          {
            line: 21,
            code: '3',
            message: 'Don’t get married before you’re thirty.',
            column: 12,
            file: '/home/file2',
            level: 'unknown_thing',
          },
          {
            line: 23,
            code: '23',
            message: 'Never use the word “moist” on a first date.',
            column: 12,
            file: '/home/THE AWESOME RULES.that',
            level: 'info',
          },
          {
            line: 30,
            code: '15',
            message: 'Give at least as many high fives as you get.',
            column: 1,
            file: '/home/THE AWESOME RULES.that',
            level: 'error',
          },
        ],
        summary: {
          count: {
            error: 3,
            warning: 0,
            info: 1,
            other: 1,
          },
        },
      };

      ConsoleFormatter(result);

      expect(mockConsoleLog).toHaveBeenCalled();
      result.results.forEach((e): void => {
        expect(consoleLog).toContain(e.message);
        expect(consoleLog).toContain(e.file);
        expect(consoleLog).toContain(e.line);
        expect(consoleLog).toContain(e.column);
        expect(consoleLog).toContain(e.level);
        expect(consoleLog).toContain(e.code);
      });
      expect(consoleLog).toContain('problems');
      expect(consoleLog).toContain('3 errors');
      expect(consoleLog).toContain('0 warnings');
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    test('With warning summary if there are warnings', (): void => {
      const result: Result = {
        type: 'JSON',
        results: [
          {
            line: 11,
            code: 'RULE#1',
            message: 'Play laser tag once a week.',
            column: 1,
            file: '/home/file1.test',
            level: 'warning',
          },
          {
            line: 30,
            code: '2',
            message: 'Tip generously. We ALL have to make up for Ted.',
            column: 1,
            file: '/home/file1.test',
            level: 'warning',
          },
          {
            line: 21,
            code: '3',
            message: 'Don’t get married before you’re thirty.',
            column: 12,
            file: '/home/file2',
            level: 'unknown_thing',
          },
          {
            line: 23,
            code: '23',
            message: 'Never use the word “moist” on a first date.',
            column: 12,
            file: '/home/THE AWESOME RULES.that',
            level: 'info',
          },
          {
            line: 30,
            code: '15',
            message: 'Give at least as many high fives as you get.',
            column: 1,
            file: '/home/THE AWESOME RULES.that',
            level: 'warning',
          },
        ],
        summary: {
          count: {
            error: 0,
            warning: 3,
            info: 1,
            other: 1,
          },
        },
      };

      ConsoleFormatter(result);

      expect(mockConsoleLog).toHaveBeenCalled();
      result.results.forEach((e): void => {
        expect(consoleLog).toContain(e.message);
        expect(consoleLog).toContain(e.file);
        expect(consoleLog).toContain(e.line);
        expect(consoleLog).toContain(e.column);
        expect(consoleLog).toContain(e.level);
        expect(consoleLog).toContain(e.code);
      });
      expect(consoleLog).toContain('problems');
      expect(consoleLog).toContain('0 errors');
      expect(consoleLog).toContain('3 warnings');
      expect(mockConsoleError).not.toHaveBeenCalled();
    });
  });
});
