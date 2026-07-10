export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const isNotFoundError = (error: unknown): error is HttpError => error instanceof HttpError && error.status === 404;

export const retryQuery = (failureCount: number, error: Error) => !isNotFoundError(error) && failureCount < 2;
