type RequestConfig = {
  path?: string;
  body?: object;
  headers?: Record<string, string>;
};

export type FetchResponse<T> = ResponseOk<T> | ResponseError;
export type ResponseOk<T> = { data: T; error: undefined };
export type ResponseError = { data: undefined; error: string };

type Method = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

export class ApiClient {
  #url: string;
  #token?: string | undefined;

  constructor(url: string, token?: string) {
    this.#url = url;
    this.#token = token;
  }

  setToken = (token?: string) => (this.#token = token);

  setUrl = (url: string) => (this.#url = url);

  #buildUrl = (path?: string) => `${this.#url}${path ? path : ''}`;

  #buildHeaders = (
    headers?: Record<string, string>,
  ): Record<string, string> => {
    const tmpHeaders = {
      Authorization: `Bearer ${this.#token}`,
      'Content-Type': 'application/json'
    };
    return { ...tmpHeaders, ...headers };
  };

  #doRequest = async <T>(
    method: Method,
    { path, body, headers }: RequestConfig,
    controller?: AbortController | null
  ): Promise<FetchResponse<T>> => {
    const fullUrl = this.#buildUrl(path);

    const newHeaders = this.#buildHeaders(headers);

    try {
      const res = await fetch(fullUrl, {
        method: method,
        headers: new Headers(newHeaders),
        body: JSON.stringify(body),
        signal: controller?.signal ?? null
      });

      if (res.ok) {
        const data = (await res.json()) as T;
        return { data, error: undefined };
      } else {
        const error = await res.text()
        return { data: undefined, error: error?.length ? error : 'Det skjedde en uventet feil' };
      }
    } catch (error) {
      console.log(error)
      if (typeof error == 'string') {
        return { data: undefined, error };
      }
      return { data: undefined, error: 'Det skjedde en uventet feil' };
    }
  };

  protected get = <T>(
    requestConfig: RequestConfig,
  ): Promise<FetchResponse<T>> => {
    return this.#doRequest<T>('GET', requestConfig);
  };

  protected put = <T>(
    requestConfig: RequestConfig,
  ): Promise<FetchResponse<T>> => {
    return this.#doRequest<T>('PUT', requestConfig);
  };
  protected patch = <T>(
    requestConfig: RequestConfig,
  ): Promise<FetchResponse<T>> => {
    return this.#doRequest<T>('PATCH', requestConfig);
  };

  protected post = <T>(
    requestConfig: RequestConfig,
  ): Promise<FetchResponse<T>> => {
    return this.#doRequest<T>('POST', requestConfig);
  };

  protected delete = <T>(
    requestConfig: RequestConfig,
  ): Promise<FetchResponse<T>> => {
    return this.#doRequest<T>('DELETE', requestConfig);
  };
}
