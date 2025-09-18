// Default options which we fallback on
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 24;
export const LIMIT_OPTIONS = ['12', '24', '48', '96'];

/**
 * Extracts pagination parameters from URL search params with fallback to defaults.
 *
 * @param {URLSearchParams} searchParams - URL search parameters containing page and limit
 * @returns {Object} Pagination parameters and configuration options
 *
 */
export const getPaginationParams = (searchParams: URLSearchParams) => {
  const page = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const limit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);

  return { page, limit, DEFAULT_PAGE, DEFAULT_LIMIT, LIMIT_OPTIONS };
};
