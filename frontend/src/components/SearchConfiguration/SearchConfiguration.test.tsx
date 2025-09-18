import { render, screen, userEvent, waitFor } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import { Mock, vi } from 'vitest';
import { Genre } from '@/generated/graphql';
import { useDateSpan } from '@/hooks/useDateSpan';
import { useFilterCount } from '@/hooks/useFilterCount';
import { useGenres } from '@/hooks/useGenres';
import { usePageSpan } from '@/hooks/usePageSpan';
import { updateQueryParams } from '@/utils/queryParams';
import SearchConfiguration from './SearchConfiguration';

// Mock hooks and utils
vi.mock('@/hooks/useFilterCount');
vi.mock('@/hooks/useDateSpan');
vi.mock('@/hooks/usePageSpan');
vi.mock('@/utils/queryParams');
vi.mock('@/hooks/useGenres');

// Mock data
const mockGenres: Genre[] = [
  { name: 'Fiction' },
  { name: 'Non-Fiction' },
  { name: 'Action' },
  { name: 'Adventure' },
];

// Configure mocks
beforeEach(() => {
  (useFilterCount as Mock).mockReturnValue({
    filterCount: {
      authors: [{ name: 'John Doe', count: 5 }],
      publishers: [{ name: 'Penguin', count: 3 }],
      genres: [
        { name: 'Fiction', count: 10 },
        { name: 'Non-Fiction', count: 15 },
      ],
      ratings: [{ rating: 4, count: 8 }],
    },
    loading: false,
    error: null,
  });

  (useDateSpan as Mock).mockReturnValue({
    earliestDate: 2000,
    latestDate: 2022,
    loading: false,
  });

  (usePageSpan as Mock).mockReturnValue({
    leastPages: 100,
    mostPages: 1000,
    loading: false,
  });

  (updateQueryParams as Mock).mockImplementation((setSearchParams, key, value) => {
    setSearchParams({ [key]: value });
  });

  (useGenres as Mock).mockReturnValue({
    genres: mockGenres,
    loading: false,
    error: null,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('SearchConfiguration', () => {
  it('renders search filters correctly', () => {
    render(
      <MemoryRouter>
        <SearchConfiguration useDrawer={false} />
      </MemoryRouter>
    );

    // Verify rendered elements
    expect(screen.getAllByText(/Sort by/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText('Genres')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Authors/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Publisher/i)[0]).toBeInTheDocument();
  });

  it('updates search params when changing filters', async () => {
    render(
      <MemoryRouter>
        <SearchConfiguration useDrawer={false} />
      </MemoryRouter>
    );

    const sortBySelect = screen.getAllByLabelText(/Sort by/i)[0];
    await userEvent.click(sortBySelect);
    await userEvent.click(screen.getByRole('option', { name: /Author name/i }));

    await waitFor(() => {
      expect(updateQueryParams).toHaveBeenCalledWith(expect.any(Function), 'sortBy', 'authorName');
    });
  });

  it('resets filters to default values', async () => {
    render(
      <MemoryRouter>
        <SearchConfiguration useDrawer={false} />
      </MemoryRouter>
    );

    // Simulate user changing a filter
    const sortBySelect = screen.getAllByLabelText('Sort by')[0];
    await userEvent.click(sortBySelect);
    await userEvent.click(screen.getByRole('option', { name: /Publisher name/i }));
    await waitFor(() => {
      expect(updateQueryParams).toHaveBeenCalledWith(
        expect.any(Function),
        'sortBy',
        'publisherName'
      );
    });

    // Click reset button
    await userEvent.click(screen.getByRole('button', { name: /Reset filters to default values/i }));

    // Check that params were reset to defaults
    await waitFor(() => {
      expect(updateQueryParams).toHaveBeenCalledWith(expect.any(Function), 'sortBy', 'bookName');
    });
  });

  it('displays error message when filterCount fails to load', async () => {
    (useFilterCount as Mock).mockReturnValueOnce({
      filterCount: null,
      loading: false,
      error: { message: 'Failed to load filters' },
    });

    render(
      <MemoryRouter>
        <SearchConfiguration useDrawer={false} />
      </MemoryRouter>
    );
    const error = await waitFor(() => screen.getByText(/Error fetching filters/i));
    expect(error).toBeInTheDocument();
  });
});
