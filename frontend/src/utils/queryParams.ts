import { SetURLSearchParams } from 'react-router-dom';

/**
 * Updates the URL search parameters based on the provided key and value.
 * Handles different types of values (single string, array of strings, or undefined).
 * This function handles consecutive calls.
 *
 * @param {SetURLSearchParams} setSearchParams - Function to update the URL search parameters
 * @param {string} key - The key of the query parameter to update
 * @param {string | string[] | undefined} value - The value to set for the query parameter
 *
 * @example
 * updateQueryParams(setSearchParams, 'search', 'newSearchQuery')
 * updateQueryParams(setSearchParams, 'genres', ['tag1', 'tag2'])
 * updateQueryParams(setSearchParams, 'page', '5')
 * updateQueryParams(setSearchParams, 'page', undefined) // Removes the key
 *
 */
export const updateQueryParams = (
  setSearchParams: SetURLSearchParams,
  key: string,
  value: string | string[] | undefined
) => {
  setSearchParams((params) => {
    if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((v) => params.append(key, v));
    } else if (value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    return params;
  });
};
