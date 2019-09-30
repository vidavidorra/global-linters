import { Arguments, Glob, Linter, Result } from '.';

export function GlobalLinters(args: Arguments): Result {
  try {
    const linter = new Linter(args.linter, args.range);
    const glob = new Glob(args.glob, args.ignorePath);
    const files = glob.Files();
    return linter.LintFiles(files);
  } catch (error) {
    console.log(error);
  }
}
