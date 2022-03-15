
export class JcdTypeError extends Error {
  constructor(expectedType: string) {
    let message: string;
    message = `Invalid Type, expected ${expectedType}`;
    super(message);
    this.name = 'JcdTypeError';
  }
}
