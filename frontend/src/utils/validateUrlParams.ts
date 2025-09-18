import { SortBy, SortOrder } from '@/generated/graphql';
import { getFilterParams } from './filters';
import { getPaginationParams } from './pagination';

const isValidFilters = (sortBy: SortBy, sortOrder: SortOrder): boolean => {
  if (!Object.values(SortBy).includes(sortBy)) {
    return false;
  }

  if (!Object.values(SortOrder).includes(sortOrder)) {
    return false;
  }

  return true;
};

const isValidPagination = (page: number, limit: number, LIMIT_OPTIONS: string[]): boolean => {
  if (isNaN(page) || page <= 0) {
    return false;
  }

  if (isNaN(limit) || !LIMIT_OPTIONS.includes(limit.toString())) {
    return false;
  }

  return true;
};

/**
 * Validates URL search parameters for filters and pagination.
 * Ensures that the parameters are within expected ranges and formats.
 *
 * @param {URLSearchParams} searchParams - URL search parameters containing filter and pagination criteria
 * @returns {boolean} True if all parameters are valid, false otherwise
 */
export const isValidUrlParams = (searchParams: URLSearchParams): boolean => {
  const { sortBy, sortOrder } = getFilterParams(searchParams);
  if (!isValidFilters(sortBy, sortOrder)) {
    return false;
  }

  const { page, limit, LIMIT_OPTIONS } = getPaginationParams(searchParams);
  if (!isValidPagination(page, limit, LIMIT_OPTIONS)) {
    return false;
  }

  return true;
};
