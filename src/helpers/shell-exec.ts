import shell from 'shelljs';

export interface ShellExecResult {
  code: number;
  stdout: string;
  stderr: string;
}

export function ShellExec(
  command: string,
  options: shell.ExecOptions & { async?: false }
): ShellExecResult {
  return shell.exec(command, options);
}
