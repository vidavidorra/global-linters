import * as yargs from 'yargs';
import { Arguments, Glob, Linter } from '..';
import chalk from 'chalk';

export class Cli {
  private args: Arguments;

  public constructor() {
    this.Parse();
    this.GlobalLinters();
  }

  private Parse(): void {
    const args = yargs
      .strict(true)
      .usage(
        '$0 [options] <linter> <glob>',
        'Run globally installed linters',
        (yargs): yargs.Argv => {
          return yargs
            .positional('linter', {
              describe: 'Linter to run',
              type: 'string',
              choices: ['hadolint', 'shellcheck'],
            })
            .positional('glob', {
              describe: 'Glob pattern for searching files',
              type: 'string',
            });
        }
      )
      .options({
        'ignore-path': {
          alias: 'i',
          describe:
            'Path to a file containing patterns that describe files to ignore.',
          type: 'string',
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
      }).argv;

    this.args = {
      linter: args.linter as string,
      glob: args.glob as string,
      'ignore-path': (args['ignore-path'] as string) || undefined,
      range: (args.range as string) || undefined,
      options: (args.options as string) || undefined,
    };
  }

  private GlobalLinters(): void {
    console.log(chalk.blue('Arguments validated!'));
    console.log(chalk.gray(JSON.stringify(this.args, null, 2)));

    try {
      const linter = new Linter(this.args.linter, this.args.range);
      const glob = new Glob(this.args.glob, this.args['ignore-path']);
      glob.Files();
    } catch (error) {
      console.log(chalk.red(error), error);
    }
  }
}
