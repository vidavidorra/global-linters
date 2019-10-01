import { Arguments, Glob, Linter, Result } from '.';

export function GlobalLinters(args: Arguments): Result {
  const linter = new Linter(args.linter, args.range, args.options);
  const glob = new Glob(args.glob, args.ignorePath);
  const files = glob.Files();
  return linter.LintFiles(files);
}
