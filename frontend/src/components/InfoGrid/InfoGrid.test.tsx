import { render, screen } from '@test-utils';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { dummyBook } from '../../../test-utils/testVars';
import InfoGrid from './InfoGrid';

const tableInfos = [
  { header: 'Title', description: dummyBook.title },
  { header: 'Author', description: dummyBook.authors.map((author) => author.name).join(', ') },
  { header: 'Publisher', description: dummyBook.publisher.name },
  { header: 'Genres', description: dummyBook.genres.map((genre) => genre.name).join(', ') },
  { header: 'Pages', description: dummyBook.pages },
  { header: 'Format', description: dummyBook.bookFormat },
  {
    header: 'Characters',
    description: dummyBook.characters?.join(', ') ?? 'No characters defined',
  },
  { header: 'ISBN', description: dummyBook.isbn },
  { header: 'Language', description: dummyBook.language },
];

describe('InfoGrid component', () => {
  test('renders the InfoGrid component properly based on input book', () => {
    render(<InfoGrid book={dummyBook} />);

    tableInfos.forEach((info) => {
      expect(screen.getByText(info.header)).toBeInTheDocument();
      expect(screen.getByText(info.description)).toBeInTheDocument();
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<InfoGrid book={dummyBook} />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
