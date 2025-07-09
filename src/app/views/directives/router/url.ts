/** @internal */
const LOCALHOST = 'http://localhost';

/**
 * Append/Set provided search parameters value from the url string
 * @param url
 * @param params
 */
export function withSearchParams(url: string, params: { [key: string]: any }) {
  let _url: URL;
  let isValidURL = false;
  if (url.indexOf('://') === -1) {
    _url = new URL(`${LOCALHOST}${url}`);
  } else {
    _url = new URL(url);
    isValidURL = true;
  }
  for (const key in params) {
    if (_url.searchParams.has(key)) {
      _url.searchParams.set(key, String(params[key]));
    } else {
      _url.searchParams.append(key, String(params[key]));
    }
  }
  return isValidURL
    ? _url.toString()
    : `${_url.toString().replace(LOCALHOST, '')}`;
}

/**
 * Remove specified search parameters from the provided url
 *
 * @param url
 * @param params
 */
export function withoutSearchParams(url: string, params: string[]) {
  let _url: URL;
  let isValidURL = false;
  if (url.indexOf('://') === -1) {
    _url = new URL(`${LOCALHOST}${url}`);
  } else {
    _url = new URL(url);
    isValidURL = true;
  }
  for (const key of params) {
    if (_url.searchParams.has(key)) {
      _url.searchParams.delete(key);
    }
  }
  return isValidURL
    ? _url.toString()
    : `${_url.toString().replace(LOCALHOST, '')}`;
}
