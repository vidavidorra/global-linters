import { Arguments, Glob, Linter } from '.';

export function GlobalLinters(args: Arguments): void {
  try {
    const linter = new Linter(args.linter, args.range);
    const glob = new Glob(args.glob, args.ignorePath);
    const files = glob.Files();
    linter.LintFiles(files);
  } catch (error) {
    console.log(error);
  }
}
