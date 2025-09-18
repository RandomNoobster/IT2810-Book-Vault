import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import ReviewStack from './ReviewStack';

const dummyReviews = [
  {
    UUID: 'review-1',
    rating: 5,
    description: 'Great book!',
    at: '2023-10-30T12:00:00Z',
    book: dummyBook,
    user: {
      name: 'Name1',
      UUID: 'UUID1',
    },
  },
  {
    UUID: 'review-2',
    rating: 2,
    description: 'Hmmm!',
    at: '2023-10-30T12:00:00Z',
    book: dummyBook,
    user: {
      name: 'Name2',
      UUID: 'UUID2',
    },
  },
  {
    UUID: 'review-2',
    rating: 4,
    description: 'So good!',
    at: '2023-10-30T12:00:00Z',
    book: dummyBook,
    user: {
      name: 'Name3',
      UUID: 'UUID3',
    },
  },
];

describe('BookReviewCard Component', () => {
  test('shows no reviews found when reviews is empty', async () => {
    render(
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <ReviewStack reviews={[]} type="profileReview" />
        </MemoryRouter>
      </MantineProvider>
    );
    expect(screen.getByText('No reviews found')).toBeInTheDocument();
  });

  test('profileReviews show up properly', async () => {
    render(
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <ReviewStack reviews={dummyReviews} type="profileReview" />
        </MemoryRouter>
      </MantineProvider>
    );
    expect(screen.getByText(dummyReviews[0].user.name)).toBeInTheDocument();
    expect(screen.queryByText(`Review of ${dummyReviews[0].book.title}`)).toBeNull();
  });

  test('yourReview show up properly', async () => {
    render(
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <ReviewStack reviews={dummyReviews} type="yourReview" />
        </MemoryRouter>
      </MantineProvider>
    );
    expect(screen.getAllByText('Your review')).toHaveLength(3);
  });

  test('bookReviews show up properly', async () => {
    render(
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <ReviewStack reviews={dummyReviews} type="bookReview" />
        </MemoryRouter>
      </MantineProvider>
    );
    expect(screen.queryByText(dummyReviews[0].user.name)).toBeNull();
    expect(screen.getAllByText(`Review of ${dummyReviews[0].book.title}`)).toHaveLength(3);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <ReviewStack reviews={dummyReviews} type="profileReview" />
        </MemoryRouter>
      </MantineProvider>
    );

    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
