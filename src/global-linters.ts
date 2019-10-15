import { Arguments, FileEnumerator, Linter, Result } from '.';

export function GlobalLinters(args: Arguments): Result {
  const linter = new Linter(args.linter, args.range, args.options);
  const fileEnumerator = new FileEnumerator(args.fileAndOrGlob);

  return linter.LintFiles(fileEnumerator.Files());
}
