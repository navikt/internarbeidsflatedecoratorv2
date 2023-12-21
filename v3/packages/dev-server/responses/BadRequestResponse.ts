import { ErrorResponse } from './ErrorResponse';

export class BadRequestResponse extends ErrorResponse {
  constructor(statusText: string) {
    super(400, statusText);
  }
}
