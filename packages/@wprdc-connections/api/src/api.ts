/**
 *
 * API
 *
 * Generic API class and factory, plus some utilities.  Use with product-specific endpoints to
 * create product-specific functional APIs.
 *
 */
import { APIOptions, Endpoint, Method } from '@wprdc-types/api';

/**
 * Default headers to apply to all requests
 *
 * @type {{string: string}}
 */
const baseHeaders = {};

class API<E extends Endpoint> {
  host: string;

  constructor(host: string) {
    this.host = host;
  }

  /**
   * Base api call function.
   *
   * @param {Endpoint} endpoint - target for request
   * @param {Method} method - HTTP method to use
   * @param {Object} [options] - optional parameters
   * @param {string | number} [options.id] - id of resource at endpoint to be retrieved
   * @param {Object} [options.params] - url parameters
   * @param {Object} [options.body] - body data to supply to fetch request
   * @param {Object} [options.headers] - HTTP headers to supply to fetch
   * @param {Object} [options.fetchInit] - catchall for other fetch init options
   * @returns {Promise<Response>}
   */
  callEndpoint<T>(endpoint: E, method: Method, options?: APIOptions<T>) {
    const { id, params, headers, fetchInit, credentials } = options || {
      id: undefined,
      params: undefined,
      body: undefined,
      headers: {},
      fetchInit: {},
      credentials: undefined,
    };

    const idPath = ['object', 'undefined'].includes(typeof id) ? '' : `${id}/`;
    const urlParams = serializeParams(stripUndefineds(params));
    const url = `${this.host}/${endpoint}/${idPath}${urlParams}`;

    return fetch(url, {
      ...fetchInit,
      ...{
        method,
        headers: { ...baseHeaders, ...headers },
        credentials,
      },
    });
  }

  /**
   * Async version of base api call function.
   *
   * @param {Endpoint} endpoint - target for request
   * @param {Method} method - HTTP method to use
   * @param {Object} [options] - optional parameters
   * @param {string | number} [options.id] - id of resource at endpoint to be retrieved
   * @param {Object} [options.params] - url parameters
   * @param {Object} [options.body] - body data to supply to fetch request
   * @param {Object} [options.headers] - HTTP headers to supply to fetch
   * @param {Object} [options.fetchInit] - catchall for other fetch init options
   * @returns {Object | null}
   */
  async callAndProcessEndpoint<T = any>(
    endpoint: E,
    method: Method,
    options?: APIOptions<T>
  ): Promise<T> {
    const response = await this.callEndpoint(endpoint, method, options);
    if (response.ok) {
      const data = (await response.json()) as T;
      if (options?.validator) options.validator(data);
      return Promise.resolve(data);
    } else {
      const message = await response.text();
      throw Error(message);
    }
  }

  /** Hack for simple lists */
  async callAndProcessListEndpoint<T = any>(
    endpoint: E,
    method: Method,
    options?: APIOptions<T>
  ): Promise<T[]> {
    const response = await this.callEndpoint(endpoint, method, options);
    if (response.ok) {
      const data = (await response.json()) as { results: T[] };
      return Promise.resolve(data.results);
    } else {
      const message = await response.text();
      throw Error(message);
    }
  }
}

/**
 * Convert an object of paramaters ({param1: value1, etc...}) for a request to
 * a query string ("?param1=value1&p2=v2...")
 *
 * @param {Object} params - object of key value pairs of parameters
 * @returns {string} - url query string representation of `params`
 */
export function serializeParams(params?: object) {
  if (!params || !Object.keys(params)) return '';
  return `?${Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')}`;
}

export function createAPI<E extends Endpoint>(host: string): API<E> {
  return new API<E>(host);
}

function stripUndefineds(params?: object) {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != undefined)
  );
}
