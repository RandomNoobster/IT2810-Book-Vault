import { render } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import { Book } from '@/generated/graphql';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import BookCardGrid from './BookCardGrid';

const dummyBooks: Book[] = Array.from({ length: 10 }, (_, index) => ({
  ...dummyBook,
  id: (index + 1).toString(),
}));

describe('Bookcard component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <BookCardGrid books={dummyBooks} loading={false} error={undefined} />
      </MemoryRouter>
    );
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
