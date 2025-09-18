import { render, screen } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import { useRandomBook } from '@/hooks/useRandomBook';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { HeroHeader } from './HeroHeader';

vi.mock('@/hooks/useRandomBook');

describe('HeroHeader component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    (useRandomBook as jest.Mock).mockReturnValue({ id: '1', loading: false, error: null });

    const { asFragment } = render(
      <MemoryRouter>
        <HeroHeader />
      </MemoryRouter>
    );
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });

  it('handles error state correctly', () => {
    (useRandomBook as jest.Mock).mockReturnValue({
      id: null,
      loading: false,
      error: new Error('Error'),
    });

    render(
      <MemoryRouter>
        <HeroHeader />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('random-book-button')).not.toBeInTheDocument();
  });

  it('links to the correct URL when a book ID is present', () => {
    (useRandomBook as jest.Mock).mockReturnValue({ id: '1', loading: false, error: null });

    render(
      <MemoryRouter>
        <HeroHeader />
      </MemoryRouter>
    );

    const button = screen.getByTestId('random-book-button');
    expect(button).toHaveAttribute('href', '/books/1');
  });

  it('links to the home page when no book ID is present', () => {
    (useRandomBook as jest.Mock).mockReturnValue({ id: null, loading: false, error: null });

    render(
      <MemoryRouter>
        <HeroHeader />
      </MemoryRouter>
    );

    const button = screen.getByTestId('random-book-button');
    expect(button).toHaveAttribute('href', '/');
  });
});
