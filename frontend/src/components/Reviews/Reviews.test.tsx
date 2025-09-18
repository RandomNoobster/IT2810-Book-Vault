import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import Reviews from './Reviews';

vi.mock('@mantine/charts', async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: '100%', height: '100%' }}>{children}</div>
    ),
  };
});

const customRender = () => {
  return render(
    <MockedProvider addTypename={false}>
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <Reviews book={dummyBook} />
        </MemoryRouter>
      </MantineProvider>
    </MockedProvider>
  );
};

describe('Reviews Component', () => {
  beforeEach(() => {
    // Mocking BookReviews and YourReviewHandler as these have their own tests

    vi.mock('@/components/BookReviews/BookReviews', () => ({
      default: () => {
        return <div>BookReview mock</div>;
      },
    }));

    vi.mock('@/components/YourReviewHandler/YourReviewHandler', () => ({
      default: () => {
        return <div>YourReviewHandler mock</div>;
      },
    }));
  });

  test('header and average rating renders properly', async () => {
    customRender();

    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText(dummyBook.rating.toFixed(1))).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = customRender();

    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
