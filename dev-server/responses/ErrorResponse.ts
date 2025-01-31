import { BaseResponse } from './BaseResponse';

export class ErrorResponse extends BaseResponse {
  constructor(statusCode: number, statusText?: string) {
    super({ error: statusText, statusCode });
  }
}
