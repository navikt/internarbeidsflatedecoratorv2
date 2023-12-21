interface Props<T> {
  data?: T;
  error?: string;
  statusCode: number;
}

export class BaseResponse<T = undefined> extends Response {
  constructor({ data, error, statusCode }: Props<T>) {
    super(JSON.stringify(data), { status: statusCode, statusText: error });
  }
}
