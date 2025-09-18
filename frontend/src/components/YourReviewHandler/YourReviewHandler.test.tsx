import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { useUser } from '@/contexts/UserFunctions';
import { makeReview } from '@/hooks/makeReview';
import { updateReview } from '@/hooks/updateReview';
import { useYourBookReview } from '@/hooks/useYourBookReview';
import { theme } from '@/theme';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import YourReviewHandler from './YourReviewHandler';

vi.mock('@/contexts/UserFunctions', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/hooks/makeReview', () => ({
  makeReview: vi.fn(),
}));

vi.mock('@/hooks/updateReview', () => ({
  updateReview: vi.fn(),
}));

vi.mock('@/hooks/useYourBookReview', () => ({
  useYourBookReview: vi.fn(),
}));

const dummyUser = {
  info: {
    name: 'You',
    UUID: 'UUID1',
    secret: 'secret',
  },
};

const dummyReview = {
  UUID: 'review-1',
  rating: 2,
  description: 'Great book!',
  at: '2023-10-30T12:00:00Z',
};

const customRender = () => {
  return render(
    <MockedProvider addTypename={false}>
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <YourReviewHandler book={dummyBook} />
        </MemoryRouter>
      </MantineProvider>
    </MockedProvider>
  );
};

describe('YourReviewHandler Component', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue(dummyUser);
    (makeReview as jest.Mock).mockReturnValue({
      submitReview: vi.fn(),
      updatedRating: undefined,
      loading: false,
    });
    (updateReview as jest.Mock).mockReturnValue({
      submitUpdate: vi.fn(),
      updatedRating: undefined,
      loading: false,
      error: null,
    });
    (useYourBookReview as jest.Mock).mockReturnValue({
      review: undefined,
      refetch: vi.fn(),
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('that "Give Review" and "Cancel" buttons work', async () => {
    customRender();

    // Check that clicking the Give Review and cancel works properly
    expect(screen.getByText('Give Review')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Give Review'));

    expect(screen.getByText('Submit Review')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Your rating')).toBeInTheDocument();
    expect(screen.getByText('Your review')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Give Review')).toBeInTheDocument();
  });

  test('"Edit Review" option shows up when you have made a review', async () => {
    (useYourBookReview as jest.Mock).mockReturnValue({
      review: dummyReview,
      refetch: vi.fn(),
      loading: false,
      error: undefined,
    });

    customRender();

    expect(screen.getByText('Edit Review')).toBeInTheDocument();
  });

  test('"Cancel" reverts changes you made', async () => {
    (useYourBookReview as jest.Mock).mockReturnValue({
      review: dummyReview,
      refetch: vi.fn(),
      loading: false,
      error: undefined,
    });

    customRender();

    expect(screen.getByText('Edit Review')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Edit Review'));

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated review text' } });

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText(dummyReview.description)).toBeInTheDocument();
  });

  test('submits a new review', async () => {
    const submitReviewMock = vi.fn();
    (makeReview as jest.Mock).mockReturnValue({ submitReview: submitReviewMock, loading: false });

    customRender();

    fireEvent.click(screen.getByText('Give Review'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'A great one!' } });
    fireEvent.click(screen.getByText('Submit Review'));

    await waitFor(() => {
      expect(submitReviewMock).toHaveBeenCalledWith({
        userUUID: dummyUser.info.UUID,
        bookID: dummyBook.id,
        description: 'A great one!',
        rating: 1,
      });
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = customRender();

    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
