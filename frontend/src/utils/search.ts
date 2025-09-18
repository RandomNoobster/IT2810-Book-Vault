/**
 * Extracts the search parameter from the URL.
 * This function ensures that the search parameters are correctly parsed and returned in a consistent format.
 *
 * @param {URLSearchParams} searchParams - URL search parameters containing search criteria
 * @returns {Object} Search parameters
 *
 */
export const getSearchParams = (searchParams: URLSearchParams) => {
  const searchValue = searchParams.get('search') || '';
  return { searchValue };
};
