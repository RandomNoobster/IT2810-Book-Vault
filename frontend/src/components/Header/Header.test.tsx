import { fireEvent, render, screen } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import { useMantineColorScheme } from '@mantine/core';
import { Header } from '@/components/Header/Header';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useRouteError: vi.fn(),
    isRouteErrorResponse: vi.fn(),
    Link: ({ children }: any) => <a href="/">{children}</a>, // Mock <Link> for simplicity
  };
});

vi.mock('@mantine/core', async () => {
  const actual = await vi.importActual('@mantine/core');
  return {
    ...actual,
    useMantineColorScheme: vi.fn(),
  };
});

const mockSetColorScheme = vi.fn();

describe('HeaderSimple Component', () => {
  beforeEach(() => {
    (useMantineColorScheme as jest.Mock).mockReturnValue({
      setColorScheme: mockSetColorScheme,
      colorScheme: 'light',
    });
  });

  test('renders navigation links correctly', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const homeLink = screen.getByText(/home/i);
    const booksLink = screen.getByText(/books/i);

    expect(homeLink).toBeInTheDocument();
    expect(booksLink).toBeInTheDocument();
  });

  test('toggles color scheme on click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const toggleButton = screen.getByLabelText(/change color theme/i);

    fireEvent.click(toggleButton);

    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
  });
});
