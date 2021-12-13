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
  id?: string | number;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string | number | boolean>;
  fetchInit?: {};
}
