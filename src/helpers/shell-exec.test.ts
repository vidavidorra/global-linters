import { ShellExec } from '.';

describe('ShellExec', (): void => {
  const options = { silent: true };

  test('Returns stdout output', (): void => {
    const result = ShellExec('echo "hi" >&1', options);
    expect(result.stdout).not.toBe('');
    expect(result.stderr).toBe('');
  });

  test('Returns stderr output', (): void => {
    const result = ShellExec('echo "hi" >&2', options);
    expect(result.stdout).toBe('');
    expect(result.stderr).not.toBe('');
  });

  test('Returns error code', (): void => {
    const result = ShellExec('exit 1', options);
    expect(result.code).toBe(1);
  });
});
