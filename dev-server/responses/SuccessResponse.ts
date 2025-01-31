import { BaseResponse } from './BaseResponse';

export class SuccessResponse<T = undefined> extends BaseResponse<T> {
  constructor(data?: T, statusCode = 200) {
    super({ data, statusCode });
  }
}
