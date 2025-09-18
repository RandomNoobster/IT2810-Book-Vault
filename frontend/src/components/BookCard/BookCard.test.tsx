import { render } from '@test-utils';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import BookCard from './BookCard';

describe('Bookcard component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<BookCard book={dummyBook} />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
