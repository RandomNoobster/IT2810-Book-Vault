import { describe, expect, it, vi } from 'vitest';
import { SortBy, SortOrder } from '@/generated/graphql';
import { getFilterParams } from './filters';
import { getPaginationParams } from './pagination';
import { isValidUrlParams } from './validateUrlParams';

// Mock getFilterParams and getPaginationParams
vi.mock('./filters', async () => {
  const actual = await vi.importActual('./filters'); // Get the actual implementation if needed
  return {
    ...actual,
    getFilterParams: vi.fn(),
    SortBy: {
      Book: 'book',
      Author: 'author',
      Publisher: 'publisher',
    },
    SortOrder: {
      Ascending: 'asc',
      Descending: 'desc',
    },
  };
});

vi.mock('./pagination', async () => {
  return {
    getPaginationParams: vi.fn(),
    LIMIT_OPTIONS: ['10', '25', '50', '100'],
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 25,
  };
});
describe('isValidUrlParams', () => {
  it('returns true for valid filter and pagination params', () => {
    const searchParams = new URLSearchParams({
      sortBy: 'book',
      sortOrder: 'asc',
      page: '1',
      limit: '25',
    });

    // Mocking the return values of getFilterParams and getPaginationParams
    (getFilterParams as jest.Mock).mockReturnValue({
      sortBy: SortBy.BookName,
      sortOrder: SortOrder.Asc,
    });

    (getPaginationParams as jest.Mock).mockReturnValue({
      page: 1,
      limit: 25,
      LIMIT_OPTIONS: ['10', '25', '50', '100'],
    });

    expect(isValidUrlParams(searchParams)).toBe(true);
  });

  it('returns false for invalid sortBy param', () => {
    const searchParams = new URLSearchParams({
      sortBy: 'invalidSortBy', // Invalid sortBy
      sortOrder: 'asc',
      page: '1',
      limit: '25',
    });

    (getFilterParams as jest.Mock).mockReturnValue({
      sortBy: 'invalidSortBy',
      sortOrder: SortOrder.Asc,
    });

    (getPaginationParams as jest.Mock).mockReturnValue({
      page: 1,
      limit: 25,
      LIMIT_OPTIONS: ['10', '25', '50', '100'],
    });

    expect(isValidUrlParams(searchParams)).toBe(false);
  });

  it('returns false for invalid sortOrder param', () => {
    const searchParams = new URLSearchParams({
      sortBy: 'book',
      sortOrder: 'invalidOrder', // Invalid sortOrder
      page: '1',
      limit: '25',
    });

    (getFilterParams as jest.Mock).mockReturnValue({
      sortBy: SortBy.BookName,
      sortOrder: 'invalidOrder',
    });

    (getPaginationParams as jest.Mock).mockReturnValue({
      page: 1,
      limit: 25,
      LIMIT_OPTIONS: ['10', '25', '50', '100'],
    });

    expect(isValidUrlParams(searchParams)).toBe(false);
  });

  it('returns false for invalid pagination page param', () => {
    const searchParams = new URLSearchParams({
      sortBy: 'book',
      sortOrder: 'asc',
      page: '-1', // Invalid page
      limit: '25',
    });

    (getFilterParams as jest.Mock).mockReturnValue({
      sortBy: SortBy.BookName,
      sortOrder: SortOrder.Asc,
    });

    (getPaginationParams as jest.Mock).mockReturnValue({
      page: -1,
      limit: 25,
      LIMIT_OPTIONS: ['10', '25', '50', '100'],
    });

    expect(isValidUrlParams(searchParams)).toBe(false);
  });

  it('returns false for invalid pagination limit param', () => {
    const searchParams = new URLSearchParams({
      sortBy: 'book',
      sortOrder: 'asc',
      page: '1',
      limit: '9999', // Invalid limit
    });

    (getFilterParams as jest.Mock).mockReturnValue({
      sortBy: SortBy.BookName,
      sortOrder: SortOrder.Asc,
    });

    (getPaginationParams as jest.Mock).mockReturnValue({
      page: 1,
      limit: 9999,
      LIMIT_OPTIONS: ['10', '25', '50', '100'],
    });

    expect(isValidUrlParams(searchParams)).toBe(false);
  });
});
