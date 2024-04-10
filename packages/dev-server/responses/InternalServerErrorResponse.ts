import { ErrorResponse } from './ErrorResponse';

export class InternalServerErrorResponse extends ErrorResponse {
  constructor(statusText?: string) {
    super(500, statusText);
  }
}
