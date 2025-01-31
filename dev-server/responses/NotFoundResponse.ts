import { ErrorResponse } from './ErrorResponse';

export class NotFoundResponse extends ErrorResponse {
  constructor(statusText?: string) {
    super(404, statusText);
  }
}
