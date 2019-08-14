# global-linters

Linter wrappers for globally installed linters.

## Table of contents

- [Badges](#badges)
- [CLI](#cli)
- [API](#api)
- [License](#license)

<a name="badges"></a>

## Badges

| Badge                                                                                                                                                                                                               | Description               | Service              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------- |
| <a href="https://github.com/prettier/prettier#readme"><img alt="code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>                                                | Code style                | Prettier             |
| <a href="https://conventionalcommits.org"><img alt="Conventional Commits: 1.0.0" src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square"></a>                                  | Commit style              | Conventional Commits |
| <a href="https://codecov.io/gh/vidavidorra/global-linters"><img alt="Code coverage" src="https://img.shields.io/codecov/c/github/vidavidorra/global-linters/master?style=flat-square"></a>                          | Code coverage             | Codecov              |
| <a href="https://app.shippable.com/github/vidavidorra/global-linters/dashboard"><img alt="Shippable build status" src="https://img.shields.io/shippable/5ce5ad4ebbceea0007a23c7c/master.svg?style=flat-square"></a> | CI status: Build and test | Shippable            |
| <a href="https://travis-ci.org/vidavidorra/global-linters"><img alt="Travis CI build status" src="https://img.shields.io/travis/vidavidorra/global-linters?branch=master&style=flat-square"></a>                    | CI status: Commit style   | Travis CI            |

<a name="cli"></a>

## CLI

Run the CLI without any arguments to see the options. The options are also described in the table and paragraphs below.

| Argument              | Usage      | Type                              | Reference                   |
| --------------------- | ---------- | --------------------------------- | --------------------------- |
| `linter`              | Required   | String [`hadolint`, `shellcheck`] | [details](#cli-linter)      |
| `glob`                | Required   | String                            | [details](#cli-glob)        |
| `--ignore-path`, `-i` | _Optional_ | String                            | [details](#cli-ignore-path) |
| `--range`, `-r`       | _Optional_ | String                            | [details](#cli-range)       |
| `--options`           | _Optional_ | String                            | [details](#cli-options)     |
| `—version`, `-v`      | _Optional_ | Boolean                           |                             |
| `—help`, `-h`         | _Optional_ | Boolean                           |                             |

<a name="cli-linter"></a>

## `linter`

Linter to run. Currently the list below shows the supported linter. If your favourite linter is not supported, please [create a ticket](https://github.com/vidavidorra/global-linters/issues/new) to discuss adding support for it.

- [hadolint](https://github.com/hadolint/hadolint) - Dockerfile Linter

  > A smarter Dockerfile linter that helps you build [best practice](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices) Docker images. The linter is parsing the Dockerfile into an AST and performs rules on top of the AST. It is standing on the shoulders of [ShellCheck](https://github.com/koalaman/shellcheck) to lint the Bash code inside `RUN` instructions.

- [shellcheck](https://github.com/koalaman/shellcheck) - A shell script static analysis tool

  > The goals of ShellCheck are
  >
  > - To point out and clarify typical beginner's syntax issues that cause a shell to give cryptic error messages.
  > - To point out and clarify typical intermediate level semantic problems that cause a shell to behave strangely and counter-intuitively.
  > - To point out subtle caveats, corner cases and pitfalls that may cause an advanced user's otherwise working script to fail under future circumstances.

<a name="cli-glob"></a>

## `glob`

Glob pattern for searching files. The glob syntax of the glob module is used, so the given pattern must be according to the [syntax of node-glob](https://github.com/isaacs/node-glob#glob-primer).

<a name="cli-ignore-path"></a>

### `--ignore-path`, `-i`

Path to a file containing patterns that describe files to ignore. By default it looks for `./.prettierignore`. The patterns in the ignore file should be according to the [.gitignore specification](http://git-scm.com/docs/gitignore).

<a name="cli-range"></a>

### `--range`, `-r`

Version range the linter must satisfy. The range must be specified according to the [node-semver ranges specification](https://github.com/npm/node-semver#ranges) and will show an error otherwise. This option only works if the linter supports a version option, which for some linters is not included in early versions. The table below shows for which versions of each supported linter the range option is supported.

| Linter     | Range option supported from version | Reference                                                                     |
| ---------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| hadolint   | `>=1.2.0`                           | [v1.2 release notes](https://github.com/hadolint/hadolint/releases/tag/v1.2). |
| shellcheck | `>=0.3.1`                           | Commit [4e5d32b](https://github.com/koalaman/shellcheck/commit/4e5d32b).      |

<a name="cli-options"></a>

### `--options`

Options to pass to the linter. When you use string arguments that include dashes (`-`), those will be seen as a separate option by the shell instead of part of the string. The problem is that shells like bash tend to strip quotes. The solution for this is to wrap the string in two sets of quotes of which there are two options.

1. Use double quotes inside single quotes.

   ```shell
   --options '"--hello -x=yes -v"'
   ```

2. Use escaped double quotes inside double quotes.

   ```shell
   --options "\"--hello -x=yes -v\""
   ```

<a name="api"></a>

## API

These docs will be added in the first (full) release 1.0.0.

<a name="license"></a>

## License

This project is licensed under the [GPLv3 license](https://www.gnu.org/licenses/gpl.html).

Copyright © 2019 Jeroen de Bruijn

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

The full text of the license is available in the _LICENSE.md_ file in this repository and [online](https://www.gnu.org/licenses/gpl.html).
