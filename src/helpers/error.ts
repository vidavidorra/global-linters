import { CustomError } from 'ts-custom-error';

export class GLError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}
