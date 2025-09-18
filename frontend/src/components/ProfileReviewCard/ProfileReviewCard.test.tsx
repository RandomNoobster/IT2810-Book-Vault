import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { removeMantineRandomAttributes } from '@/utils/tests';
import ProfileReviewCard from './ProfileReviewCard';

const dummyReview = {
  UUID: 'review-1',
  rating: 2,
  description: 'Great book!',
  at: '2023-10-30T12:00:00Z',
};

describe('ProfileReviewCard Component', () => {
  test('shows error when missing user', async () => {
    render(
      <MantineProvider theme={theme}>
        <ProfileReviewCard review={dummyReview} />
      </MantineProvider>
    );
    expect(
      screen.getByText('Type of ReviewCard is set to profileReview, but user not set')
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MantineProvider theme={theme}>
        <ProfileReviewCard
          review={{
            ...dummyReview,
            user: {
              name: 'A name',
              UUID: 'UUID',
            },
          }}
        />
      </MantineProvider>
    );

    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
