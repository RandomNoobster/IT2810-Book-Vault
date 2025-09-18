import { render, screen } from '@test-utils';
import { useUser } from '@/contexts/UserFunctions';
import { updateUserLibrary } from '@/hooks/updateUserLibrary';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import BookInfo from './BookInfo';

vi.mock('@/hooks/updateUserLibrary', () => ({
  updateUserLibrary: vi.fn(),
}));

const dummyUser = {
  info: {
    name: 'You',
    UUID: 'UUID1',
    secret: 'secret',
    wantToRead: [dummyBook.id],
    haveRead: [],
  },
};

vi.mock('@/contexts/UserFunctions', () => ({
  useUser: vi.fn(),
}));

describe('BookInfo component', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue(dummyUser);

    (updateUserLibrary as jest.Mock).mockReturnValue({
      submitUpdate: vi.fn(),
      success: true,
      message: '...',
      loading: false,
    });
  });

  test('renders the rating properly', () => {
    render(<BookInfo book={dummyBook} />);

    expect(screen.getAllByText(dummyBook.rating.toFixed(1))).toHaveLength(1);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<BookInfo book={dummyBook} />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
