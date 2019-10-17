# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.5](https://github.com/vidavidorra/global-linters/compare/v0.1.4...v0.1.5) (2019-10-17)

### Bug Fixes

- add `src` to the package's main and types ([ddb2d04](https://github.com/vidavidorra/global-linters/commit/ddb2d04))
- add type to ignorePath in FileEnumerator ([e65458b](https://github.com/vidavidorra/global-linters/commit/e65458b))
- two lint warnigns of prefer-const ([b833643](https://github.com/vidavidorra/global-linters/commit/b833643))
- update packages to latest version ([966401c](https://github.com/vidavidorra/global-linters/commit/966401c))

### Features

- add option to disable the use of ignore files ([c3388f4](https://github.com/vidavidorra/global-linters/commit/c3388f4))
- **cli:** add possibility to pass files to lint ([17854eb](https://github.com/vidavidorra/global-linters/commit/17854eb))
- **cli:** ignore files based on patterns described in an ignore path ([06e2332](https://github.com/vidavidorra/global-linters/commit/06e2332))

### [0.1.4](https://github.com/vidavidorra/global-linters/compare/v0.1.3...v0.1.4) (2019-10-01)

### Bug Fixes

- **npm:** fix 4 vunerabilities ([d2ab05d](https://github.com/vidavidorra/global-linters/commit/d2ab05d))
- cannot find module 'ts-custom-error' ([6be10d0](https://github.com/vidavidorra/global-linters/commit/6be10d0))

### [0.1.3](https://github.com/vidavidorra/global-linters/compare/v0.1.2...v0.1.3) (2019-10-01)

### Bug Fixes

- make glob output absolute paths ([a9519c5](https://github.com/vidavidorra/global-linters/commit/a9519c5))
- remove short options from arguments ([2f585a2](https://github.com/vidavidorra/global-linters/commit/2f585a2))
- remove unnecessary name check from linter test ([e8b2599](https://github.com/vidavidorra/global-linters/commit/e8b2599))
- return bool for linter JSON format support ([607aef4](https://github.com/vidavidorra/global-linters/commit/607aef4))
- simplify linter JSON support check ([70a6560](https://github.com/vidavidorra/global-linters/commit/70a6560))

### Features

- pass given options through to linter ([ae0e0ec](https://github.com/vidavidorra/global-linters/commit/ae0e0ec))
- **cli:** exit with 1 on error, 0 else ([919c458](https://github.com/vidavidorra/global-linters/commit/919c458))
- add console formatter to format the results ([7523d5a](https://github.com/vidavidorra/global-linters/commit/7523d5a))
- add helper for shell.exec ([0216404](https://github.com/vidavidorra/global-linters/commit/0216404))
- add linters ([08fca25](https://github.com/vidavidorra/global-linters/commit/08fca25))
- format linter output like ESLint ([ac93237](https://github.com/vidavidorra/global-linters/commit/ac93237))
- output JSON like ESLint and add totals ([f105742](https://github.com/vidavidorra/global-linters/commit/f105742))
- return and pass result from linter ([bf10624](https://github.com/vidavidorra/global-linters/commit/bf10624))
- use Linters for the linter specifics ([27ac35b](https://github.com/vidavidorra/global-linters/commit/27ac35b))

### [0.1.2](https://github.com/vidavidorra/global-linters/compare/v0.1.1...v0.1.2) (2019-08-15)

### Bug Fixes

- add dist to files in order to include them in the npm package ([63f1c78](https://github.com/vidavidorra/global-linters/commit/63f1c78))

### [0.1.1](https://github.com/vidavidorra/global-linters/compare/v0.1.0...v0.1.1) (2019-08-14)

## 0.1.0 (2019-08-14)

### Bug Fixes

- **linter:** specify name as custom type with choices ([1221938](https://github.com/vidavidorra/global-linters/commit/1221938))
- rename ignore-path option to ignorePath ([1523e71](https://github.com/vidavidorra/global-linters/commit/1523e71))
- **npm:** fix 2808 high severity vulnerabilities ([b3a58d0](https://github.com/vidavidorra/global-linters/commit/b3a58d0))
- move dependecies used in code to prod ([76c61a2](https://github.com/vidavidorra/global-linters/commit/76c61a2))
- print matched glob with chalk ([2e651dd](https://github.com/vidavidorra/global-linters/commit/2e651dd))
- use chalk formatted error messages ([bf44808](https://github.com/vidavidorra/global-linters/commit/bf44808))

### Features

- add CLI in separate file and bin for running CLI ([7cc3233](https://github.com/vidavidorra/global-linters/commit/7cc3233))
- add functions to get the private properties ([d22aec7](https://github.com/vidavidorra/global-linters/commit/d22aec7))
- add generic CLI ([39aed92](https://github.com/vidavidorra/global-linters/commit/39aed92))
- add linter class ([9b54c23](https://github.com/vidavidorra/global-linters/commit/9b54c23))
- add Name and Range methods to linter ([94cdfe3](https://github.com/vidavidorra/global-linters/commit/94cdfe3))
- add semver parser to get and compare version of command ([2aa4074](https://github.com/vidavidorra/global-linters/commit/2aa4074))
- implement glob for matching files ([feaf89c](https://github.com/vidavidorra/global-linters/commit/feaf89c))
- implement linting of file(s) ([9efd9f6](https://github.com/vidavidorra/global-linters/commit/9efd9f6))
- make Glob ignorePath argument optional ([83db80c](https://github.com/vidavidorra/global-linters/commit/83db80c))
