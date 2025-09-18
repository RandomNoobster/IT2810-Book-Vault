import { render, screen } from '@test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Mock, vi } from 'vitest';
import { useBook } from '@/hooks/useBook';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { Breadcrumbs } from './Breadcrumbs';

vi.mock('@/hooks/useBook', () => ({
  useBook: vi.fn(),
}));

describe('Breadcrumbs', () => {
  it('renders nothing if there is only one breadcrumb', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs />
      </MemoryRouter>
    );
    expect(screen.queryByText('/')).toBeNull();
  });

  it('renders breadcrumbs correctly', () => {
    (useBook as Mock).mockReturnValue({ book: { title: 'Test Book' } });

    render(
      <MemoryRouter initialEntries={['/books/1']}>
        <Routes>
          <Route path="/books/:bookId" element={<Breadcrumbs />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getAllByText('/')).toHaveLength(2);
  });

  it('renders multiple breadcrumbs correctly', () => {
    (useBook as Mock).mockReturnValue({ book: { title: 'Test Book' } });

    render(
      <MemoryRouter initialEntries={['/books/1', '/books/2']}>
        <Routes>
          <Route path="/books/:bookId" element={<Breadcrumbs />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText('/').length).toBe(2);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Breadcrumbs />
      </MemoryRouter>
    );
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
