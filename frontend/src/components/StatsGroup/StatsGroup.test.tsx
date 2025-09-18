import { render, screen } from '@test-utils';
import { useStats } from '@/hooks/useStats';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { StatsGroup } from './StatsGroup';

vi.mock('@/hooks/useStats');

describe('StatsGroup component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    (useStats as jest.Mock).mockReturnValue({
      stats: {
        totalBooks: 1000,
        totalAuthors: 200,
        totalRatings: 5000,
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { asFragment } = render(<StatsGroup />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows loading state correctly', () => {
    (useStats as jest.Mock).mockReturnValue({
      stats: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<StatsGroup />);

    expect(screen.getAllByText('. . .')).toHaveLength(3);
  });

  it('handles error state correctly', () => {
    (useStats as jest.Mock).mockReturnValue({
      stats: null,
      loading: false,
      error: new Error('Error'),
      refetch: vi.fn(),
    });

    render(<StatsGroup />);

    expect(screen.getAllByText('-')).toHaveLength(3);
  });

  it('displays the correct stats', () => {
    (useStats as jest.Mock).mockReturnValue({
      stats: {
        totalBooks: 1000,
        totalAuthors: 200,
        totalRatings: 5000,
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<StatsGroup />);

    expect(screen.getByText('1 000')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('5 000')).toBeInTheDocument();
  });
});
