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

export type Endpoint = string;

export interface APIOptions {
  id?: string | number | null;
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string | number | boolean | null | undefined>;
  fetchInit?: {};
  credentials?: 'omit' | 'same-origin' | 'include';
  controller?: AbortController;
}
