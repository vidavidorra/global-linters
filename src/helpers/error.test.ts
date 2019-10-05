import { GLError } from '.';

describe('GLError', (): void => {
  const message = 'Hello darkness, my old friend';
  test('Throws an error with the given message', (): void => {
    expect((): void => {
      throw new GLError(message);
    }).toThrow(message);
  });

  test('Throws an error with the correct error type', (): void => {
    expect((): void => {
      throw new GLError(message);
    }).toThrow(GLError);
  });
});
