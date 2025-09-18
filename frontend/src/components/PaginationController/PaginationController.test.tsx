import { fireEvent, render, screen } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import * as reactRouterDom from 'react-router-dom'; // This was the only was to get spyOn to work with useSearchParams

import { removeMantineRandomAttributes } from '@/utils/tests';
import PaginationController from './PaginationController';

vi.mock('@/hooks/usePaginationParams', () => ({
  usePaginationParams: vi.fn(() => ({ page: 1, limit: 25 })),
}));

describe('PaginationController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the pagination component', () => {
    render(
      <MemoryRouter>
        <PaginationController totalBooks={100} />
      </MemoryRouter>
    );

    expect(screen.getByText('1')).toBeInTheDocument(); // Check that page 1 is displayed
    expect(screen.getByText('4')).toBeInTheDocument(); // Check that page 4 is displayed for totalBooks = 100 and limit = 25
  });

  test('calls setSearchParams with the correct page when the page changes', () => {
    const mockSetSearchParams = vi.fn();
    vi.spyOn(reactRouterDom, 'useSearchParams').mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter>
        <PaginationController totalBooks={100} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('2')); // Simulate clicking on page 2

    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    const params = mockSetSearchParams.mock.calls[0][0];
    expect(params.get('page')).toBe('2');
  });

  test('calculates total pages correctly based on totalBooks and limit', () => {
    render(
      <MemoryRouter>
        <PaginationController totalBooks={75} />{' '}
        {/* Total 75 books with a limit of 25, should show 3 pages */}
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument(); // Check that page 3 is displayed
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<PaginationController totalBooks={75} />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
