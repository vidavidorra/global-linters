import commandExists from 'command-exists';
import semver from 'semver';
import shell from 'shelljs';
import yargs from 'yargs';

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

// console.log(argv);

function getBasicSemver(executable: string): string {
  if (commandExists.sync(executable)) {
    const versionResponse = shell.exec(`${executable} --version`, {
      silent: true,
    }).stdout;

    const semVerResult = semver.coerce(versionResponse);
    if (semVerResult !== null) {
      return semVerResult.version;
    }

    throw new Error(
      `Could not get version from ${executable} using '${executable} --version'`
    );
  }

  throw new Error(`Could not find executable for '${executable}`);
}

const version = getBasicSemver(argv.linter);
const requiredVersion = '^1.16.3';
const res = semver.satisfies(version, requiredVersion);
console.log(`'${version} satisfies ${requiredVersion}: ${res}`);

/**
 * Version usage based on the shellcheck source files. This option was added in
 * v0.3.1, so the version validation only works for shellcheck ^0.3.1.
 *
 * v0.3.1: https://github.com/koalaman/shellcheck/blob/v0.3.1/shellcheck.hs#L297
 * v0.6.0: https://github.com/koalaman/shellcheck/blob/v0.6.0/shellcheck.hs#L418
 */

/**
 * Version usage based on the hadolint source files. This option has adopted
 * semver in v1.2.1, so the version validation only works for hadolint ^1.2.1.
 *
 * v1.2.1: https://github.com/hadolint/hadolint/blob/v1.2.1/app/Main.hs#L54
 * v1.16.3: https://github.com/hadolint/hadolint/blob/v1.16.3/app/Main.hs#L121
 */

/*
Don't forget the quotes around the globs! The quotes make sure that this program expands
the globs rather than your shell, for cross-platform usage.
The glob syntax from the glob module is used.
https://github.com/isaacs/node-glob/blob/master/README.md#glob-primer
*/
