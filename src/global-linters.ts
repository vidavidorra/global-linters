import { Arguments, Glob, Linter, LinterNames } from '.';

export function GlobalLinters(args: Arguments): void {
  try {
    const linter = new Linter(args.linter as LinterNames, args.range);
    const glob = new Glob(args.glob, args.ignorePath);
    const files = glob.Files();
    linter.LintFiles(files);
  } catch (error) {
    console.log(error);
  }
}
