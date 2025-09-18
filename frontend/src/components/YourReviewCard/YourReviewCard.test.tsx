import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { removeMantineRandomAttributes } from '@/utils/tests';
import YourReviewCard from './YourReviewCard';

const dummyReview = {
  UUID: 'review-1',
  rating: 2,
  description: 'Great book!',
  at: '2023-10-30T12:00:00Z',
};

describe('YourReviewCard Component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <MantineProvider theme={theme}>
        <YourReviewCard review={dummyReview} />
      </MantineProvider>
    );

    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
