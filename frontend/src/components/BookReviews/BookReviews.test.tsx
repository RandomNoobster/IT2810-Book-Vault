import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { useUser } from '@/contexts/UserFunctions';
import { GET_BOOK_REVIEWS } from '@/graphql/queries/reviews';
import { theme } from '@/theme';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import BookReviews from './BookReviews';

vi.mock('@/contexts/UserFunctions', () => ({
  useUser: vi.fn(),
}));

const dummyUser = {
  info: {
    name: 'You',
    UUID: 'UUID1',
    secret: 'secret',
  },
};

const mocks = [
  {
    request: {
      query: GET_BOOK_REVIEWS,
      variables: {
        bookID: dummyBook.id,
        limit: 3,
        offset: 0,
        userUUID: dummyUser.info.UUID,
      },
    },
    result: {
      data: {
        bookReviews: {
          reviews: [
            {
              UUID: '1',
              description: 'Great book!',
              rating: 5,
              at: '2024-01-01',
              user: { name: 'User1', UUID: 'user1' },
            },
            {
              UUID: '2',
              description: 'Not bad',
              rating: 3,
              at: '2024-01-02',
              user: { name: 'User2', UUID: 'user2' },
            },
            {
              UUID: '3',
              description: 'Could be better',
              rating: 2,
              at: '2024-01-03',
              user: { name: 'User3', UUID: 'user3' },
            },
          ],
          pagination: {
            isLastPage: false,
          },
        },
      },
    },
  },
];

const customRender = () => {
  const mockTopRef = { current: document.createElement('div') };

  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <BookReviews bookId={dummyBook.id} top={mockTopRef} />
        </MemoryRouter>
      </MantineProvider>
    </MockedProvider>
  );
};

describe('Reviews Component', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue(dummyUser);
  });

  test('When it has responses, show them', async () => {
    customRender();

    // Wait for the mock data to render in the component
    await waitFor(() => {
      expect(screen.getByText('Great book!')).toBeInTheDocument();
      expect(screen.getByText('Not bad')).toBeInTheDocument();
      expect(screen.getByText('Could be better')).toBeInTheDocument();
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = customRender();

    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
