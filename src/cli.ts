import * as yargs from 'yargs';
import chalk from 'chalk';

interface Arguments {
  linter: string;
  glob: string;
  'ignore-path'?: string;
  i?: string;
  range?: string;
  r?: string;
  options?: string;
}

function cli(): Arguments {
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

  return {
    linter: args.linter as string,
    glob: args.glob as string,
    'ignore-path': (args['ignore-path'] as string) || undefined,
    range: (args.range as string) || undefined,
    options: (args.options as string) || undefined,
  };
}

function run(): void {
  const args = cli();

  console.log(chalk.blue('Arguments validated!'));
  console.log(chalk.gray(JSON.stringify(args, null, 2)));
}

export default { run };
