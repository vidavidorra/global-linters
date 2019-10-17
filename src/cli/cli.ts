import { Arguments, GLError, GlobalLinters } from '..';
import { ConsoleFormatter } from './console-formatter';
import chalk from 'chalk';
import yargs from 'yargs';

export class Cli {
  public Run(argv: string[]): void {
    try {
      const args = this.Parse(argv);
      const result = GlobalLinters(args);

      ConsoleFormatter(result);
      if (result.summary.count.error) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (error) {
      if (error instanceof GLError) {
        console.log(chalk.red(`Error: ${error.message}`));
      } else {
        console.log(error);
      }
      process.exit(1);
    }
  }

  public Parse(argv: string[]): Arguments {
    const args = yargs
      .strict(true)
      .usage(
        '$0 [options] <linter> <file|glob..>',
        'Run globally installed linters',
        (yargs): yargs.Argv => {
          return yargs
            .positional('linter', {
              describe: 'Linter to run',
              type: 'string',
              choices: ['hadolint', 'shellcheck'],
            })
            .positional('file|glob', {
              describe:
                'Files and/or glob patterns to lint' +
                '\nNote that unquoted globs will be expanded by the shell.' +
                ' Therefore, it is recommended to quote glob patterns.',
              type: 'string',
            });
        }
      )
      .options({
        ignorePath: {
          alias: 'i',
          describe:
            'Path to a file containing patterns that describe files to ignore.',
          type: 'string',
        },
        noIgnore: {
          describe: 'Disable the use of ignore files.',
          type: 'boolean',
        },
        range: {
          alias: 'r',
          describe: 'Version range the linter must satisfy',
          type: 'string',
        },
        options: {
          describe: 'Options to pass to the linter',
          type: 'string',
        },
        version: {
          alias: 'v',
        },
        help: {
          alias: 'h',
        },
      })
      .conflicts('noIgnore', 'ignorePath')
      .parse(argv);

    return {
      linter: args.linter as string,
      fileAndOrGlob: args.glob as string[],
      ignorePath: args.ignorePath || undefined,
      noIgnore: args.noIgnore || false,
      range: args.range || undefined,
      options: args.options || undefined,
    };
  }
}
