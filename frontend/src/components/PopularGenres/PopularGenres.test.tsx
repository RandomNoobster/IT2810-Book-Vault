import { render, screen } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import { removeMantineRandomAttributes } from '@/utils/tests';
import PopularGenres from './PopularGenres';

describe('PopularGenres component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <PopularGenres />
      </MemoryRouter>
    );
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays the correct category names', () => {
    render(
      <MemoryRouter>
        <PopularGenres />
      </MemoryRouter>
    );

    const categories = [
      'Drama',
      'Historical',
      'Geography',
      'Fantasy/Fiction',
      'Adventure',
      'Literature',
    ];

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('has the correct links for each category', () => {
    render(
      <MemoryRouter>
        <PopularGenres />
      </MemoryRouter>
    );

    const categories = [
      { name: 'Drama', link: '/books?genres=Drama' },
      { name: 'Historical', link: '/books?genres=Historical' },
      { name: 'Geography', link: '/books?genres=Geography' },
      { name: 'Fantasy/Fiction', link: '/books?genres=Fantasy%2FFiction' },
      { name: 'Adventure', link: '/books?genres=Adventure' },
      { name: 'Literature', link: '/books?genres=Literature' },
    ];

    categories.forEach((category) => {
      const linkElement = screen.getByText(category.name).closest('a');
      expect(linkElement).toHaveAttribute('href', category.link);
    });
  });
});
