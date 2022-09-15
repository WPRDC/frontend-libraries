export interface ResponsePackage<T> {
  data?: T;
  error?: string;
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface APIOptions<T> {
  id?: string | number | null;
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string | number | boolean | null | undefined>;
  fetchInit?: {};
  credentials?: 'omit' | 'same-origin' | 'include';
  controller?: AbortController;
  /** function that throws error on invalid data response */
  validator?: (data: T) => void;
}


export interface API {
  host: string;

  callEndpoint<T>(endpoint: string, method: Method, options?: APIOptions<T>): Promise<Response>;

  callAndProcessEndpoint<T = any>(
    endpoint: string,
    method: Method,
    options?: APIOptions<T>,
  ): Promise<T>;

  callAndProcessListEndpoint<T = any>(
    endpoint: string,
    method: Method,
    options?: APIOptions<T>,
  ): Promise<T[]>;
}


