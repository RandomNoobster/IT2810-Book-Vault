import { fireEvent, render, screen } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import * as reactRouterDom from 'react-router-dom'; // This was the only was to get spyOn to work with useSearchParams

import { removeMantineRandomAttributes } from '@/utils/tests';
import EntriesController from './EntriesController';

vi.mock('@/utils/pagination', () => ({
  getPaginationParams: vi.fn(() => ({
    page: 1,
    limit: 10,
    DEFAULT_LIMIT: 25,
    LIMIT_OPTIONS: ['10', '25', '50', '100'],
  })),
}));

describe('EntriesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the select component with correct initial value', () => {
    render(
      <MemoryRouter>
        <EntriesController />
      </MemoryRouter>
    );

    expect(screen.getByText('Entries')).toBeInTheDocument();
    expect(screen.getByTestId('entries-select')).toHaveValue('10');
  });

  test('updates the search params when a new limit is selected', () => {
    const mockSetSearchParams = vi.fn();
    vi.spyOn(reactRouterDom, 'useSearchParams').mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter>
        <EntriesController />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('50'));

    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    const params = mockSetSearchParams.mock.calls[0][0];
    expect(params.get('limit')).toBe('50');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<EntriesController />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
