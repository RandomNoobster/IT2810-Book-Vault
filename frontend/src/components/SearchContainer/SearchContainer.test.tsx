import { fireEvent, render, screen } from '@test-utils';
import { useSearchParams } from 'react-router-dom';
import { updateQueryParams } from '@/utils/queryParams';
import { getSearchParams } from '@/utils/search';
import { removeMantineRandomAttributes } from '@/utils/tests';
import SearchContainer from './SearchContainer';

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('@/utils/queryParams', () => ({
  updateQueryParams: vi.fn(),
}));

vi.mock('@/utils/search', () => ({
  getSearchParams: vi.fn(),
}));

describe('SearchContainer', () => {
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockImplementation(() => [
      new URLSearchParams(), // Simulating an empty searchParams initially
      mockSetSearchParams, // This is a mock setter function
    ]);

    (getSearchParams as jest.Mock).mockReturnValue({ searchValue: '' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search input field', () => {
    render(<SearchContainer />);

    const searchInput = screen.getByPlaceholderText('Search for books');
    expect(searchInput).toBeInTheDocument();
  });

  it('updates search value on input change', () => {
    render(<SearchContainer />);

    const inputElement = screen.getByPlaceholderText('Search for books');
    fireEvent.input(inputElement, { target: { value: 'Harry Potter' } });

    expect(inputElement).toHaveValue('Harry Potter');
  });

  it('calls performSearch on Enter key press', async () => {
    render(<SearchContainer />);

    const inputElement = screen.getByPlaceholderText('Search for books');
    fireEvent.input(inputElement, { target: { value: 'Harry Potter' } });
    fireEvent.keyDown(inputElement, { key: 'Enter' });

    expect(updateQueryParams).toHaveBeenCalledWith(mockSetSearchParams, 'page', '1');
    expect(updateQueryParams).toHaveBeenCalledWith(mockSetSearchParams, 'search', 'Harry Potter');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SearchContainer />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
