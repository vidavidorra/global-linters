import yargs from 'yargs';
import commandExists from 'command-exists';

const argv = yargs
  .usage(
    '$0 [options] <linter> <filenames ...>',
    'Run globally installed linters',
    (yargs): void => {
      yargs.positional('linter', {
        describe: 'Linter to run',
        type: 'string',
        choices: ['hadolint', 'shellcheck'],
      });
      yargs.positional('filenames', {
        describe: 'URL to fetch content from',
        type: 'string',
      });
    }
  )
  .options({
    'ignore-path': {
      describe:
        'Path to a file containing patterns that describe files to ignore.',
      type: 'string',
    },
    options: {
      describe: 'Options to pass to the linter',
      type: 'string',
    },
    help: {
      alias: 'h',
    },
  })
  .version(false).argv;

console.log(argv, 'byee');

console.log('command exists `shellcheck`: ', commandExists.sync('shellcheck'));

/*
Don't forget the quotes around the globs! The quotes make sure that this program expands
the globs rather than your shell, for cross-platform usage.
The glob syntax from the glob module is used.
https://github.com/isaacs/node-glob/blob/master/README.md#glob-primer
*/
