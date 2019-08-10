import * as yargs from 'yargs';
import { Arguments, GlobalLinters } from '..';

export class Cli {
  private args: Arguments;
  private argv: string[];

  public constructor(argv: string[]) {
    this.argv = argv;
    this.Parse();

    GlobalLinters(this.args);
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
        ignorePath: {
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
      })
      .parse(this.argv);

    this.args = {
      linter: args.linter as string,
      glob: args.glob as string,
      ignorePath: (args.ignorePath as string) || undefined,
      range: (args.range as string) || undefined,
      options: (args.options as string) || undefined,
    };
  }
}
