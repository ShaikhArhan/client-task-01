import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Per-call config — merged on top of factory defaults on every request */
export interface AppAxiosRequestConfig {
  /** Extra HTTP headers merged with defaultHeaders */
  headers?: Record<string, string>;
  /** URL query-string params (?key=value) merged with defaultQuery */
  query?: Record<string, string | number | boolean>;
  /** URL path-param tokens (:id, :slug …) merged with defaultParams */
  params?: Record<string, string | number>;
  /** Request body — overrides defaultBody when provided */
  body?: unknown;
}

/** Config passed once when creating the instance */
export interface AppAxiosFactoryConfig {
  /** Base URL prepended to every request URL */
  baseURL: string;
  /** Default headers sent on every request */
  defaultHeaders?: Record<string, string>;
  /** Default query-string params sent on every request */
  defaultQuery?: Record<string, string | number | boolean>;
  /** Default URL path params used on every request */
  defaultParams?: Record<string, string | number>;
  /** Default body sent when no body is provided per call */
  defaultBody?: unknown;
}

/** Public instance returned by createAppAxios */
export interface AppAxiosInstance {
  get:    <T = unknown>(url: string, config?: AppAxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post:   <T = unknown>(url: string, config?: AppAxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put:    <T = unknown>(url: string, config?: AppAxiosRequestConfig) => Promise<AxiosResponse<T>>;
  patch:  <T = unknown>(url: string, config?: AppAxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = unknown>(url: string, config?: AppAxiosRequestConfig) => Promise<AxiosResponse<T>>;
  /** Attach any custom method: appAxios.upload = (url, file) => ... */
  [customMethod: string]: unknown;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ---------------------------------------------------------------------------
// Helper — replace :token placeholders in URL with resolved param values
// e.g. resolvePathParams('/student/:id', { id: '42' }) → '/student/42'
// ---------------------------------------------------------------------------

const resolvePathParams = (
  url: string,
  params: Record<string, string | number>
): string =>
  url.replace(/:([a-zA-Z_]+)/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `:${key}`
  );

// ---------------------------------------------------------------------------
// Factory — createAppAxios
// ---------------------------------------------------------------------------

const createAppAxios = (factoryConfig: AppAxiosFactoryConfig): AppAxiosInstance => {
  const {
    baseURL,
    defaultHeaders = {},
    defaultQuery   = {},
    defaultParams  = {},
    defaultBody    = undefined
  } = factoryConfig;

  // One internal axios instance per factory call — base URL lives here
  const axiosInstance = axios.create({ baseURL });

  // ---------------------------------------------------------------------------
  // Core request builder — merges factory defaults with per-call overrides
  // ---------------------------------------------------------------------------
  const request = <T = unknown>(
    method: HttpMethod,
    url: string,
    callConfig: AppAxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    // Merge: factory defaults come first, per-call values win
    const mergedHeaders = { ...defaultHeaders, ...(callConfig.headers ?? {}) };
    const mergedQuery   = { ...defaultQuery,   ...(callConfig.query   ?? {}) };
    const mergedParams  = { ...defaultParams,  ...(callConfig.params  ?? {}) };
    const mergedBody    =
      callConfig.body !== undefined ? callConfig.body : defaultBody;

    // Resolve :param tokens in URL path
    const resolvedUrl = resolvePathParams(url, mergedParams);

    const axiosConfig: AxiosRequestConfig = {
      method,
      url:     resolvedUrl,
      headers: mergedHeaders,
      params:  mergedQuery,  // axios sends these as ?key=value query strings
      data:    mergedBody
    };

    return axiosInstance.request<T>(axiosConfig);
  };

  // ---------------------------------------------------------------------------
  // Public instance — standard HTTP methods + open index for custom methods
  // ---------------------------------------------------------------------------
  const instance: AppAxiosInstance = {
    get:    (url, config) => request('GET',    url, config),
    post:   (url, config) => request('POST',   url, config),
    put:    (url, config) => request('PUT',    url, config),
    patch:  (url, config) => request('PATCH',  url, config),
    delete: (url, config) => request('DELETE', url, config)
  };

  return instance;
};

// ---------------------------------------------------------------------------
// App-wide singleton — import { appAxios } wherever you need to call the API.
//
// Custom methods example:
//   appAxios.upload = (url: string, file: File) => { ... }
// ---------------------------------------------------------------------------

export const appAxios = createAppAxios({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
});

export default createAppAxios;
