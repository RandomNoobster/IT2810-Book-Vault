import { render, screen } from '@test-utils';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import BookListViewCard from './BookListViewCard';

describe('BookListViewCard', () => {
  it('renders book details correctly', () => {
    render(<BookListViewCard book={dummyBook} />);

    expect(screen.getByText(dummyBook.title)).toBeInTheDocument();
    expect(
      screen.getByText(dummyBook.authors.map((author) => author.name).join(', '))
    ).toBeInTheDocument();
    expect(
      screen.getByText(dummyBook.genres.map((genre) => genre.name).join(', '))
    ).toBeInTheDocument();
    expect(screen.getByText(dummyBook.description)).toBeInTheDocument();
  });

  it('uses fallback image when cover image is not available', () => {
    const bookWithoutCoverImg = { ...dummyBook, coverImg: '' };
    render(<BookListViewCard book={bookWithoutCoverImg} />);

    const image = screen.getByAltText(`Cover image for ${dummyBook.title}`);
    expect(image).toHaveAttribute(
      'src',
      'https://placehold.co/200x300?text=Cover%20image%20for%20book'
    );
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<BookListViewCard book={dummyBook} />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
