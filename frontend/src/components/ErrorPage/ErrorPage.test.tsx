// ErrorPage.test.tsx
import { fireEvent, render, screen } from '@test-utils';
import { isRouteErrorResponse, MemoryRouter, useRouteError } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { ErrorPage } from './ErrorPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useRouteError: vi.fn(),
    isRouteErrorResponse: vi.fn(),
    Link: ({ children }: any) => <a href="/">{children}</a>, // Mock <Link> for simplicity
  };
});

describe('ErrorPage Component', () => {
  it('renders 404 error page when error status is 404', () => {
    (useRouteError as jest.Mock).mockReturnValue({
      status: 404,
    });
    (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(true);

    const container = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(container.baseElement.getElementsByTagName('svg')[0]).toBeInTheDocument();
    expect(screen.getByText('Nothing to see here')).toBeInTheDocument();
    expect(screen.getByText(/page you are trying to open does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /take me back to safe ground/i })).toBeInTheDocument();
  });

  it('renders unexpected error page when error is not 404', () => {
    const error = new Error('Test error message');
    (useRouteError as jest.Mock).mockReturnValue(error);
    (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Unexpected Application Error!')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong, please try again.')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument(); // Error message
    expect(screen.getByText(/Error: Test error message/i)).toBeInTheDocument(); // Stack trace
    expect(screen.getByRole('link', { name: /take me back to safe ground/i })).toBeInTheDocument();
  });

  it('toggles error message visibility on button click in unexpected error page', () => {
    const error = new Error('Test error message');
    (useRouteError as jest.Mock).mockReturnValue(error);
    (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(false);

    // Render the ErrorPage inside MemoryRouter
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    // Ensure the error message is initially visible
    const toggleButton = screen.getByRole('button', { name: /hide error message/i });
    expect(screen.getByText('Test error message')).toBeVisible();

    // Click to hide the error message
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Test error message')).not.toBeVisible();

    // Click to show the error message again
    fireEvent.click(screen.getByRole('button', { name: /open error message/i }));
    expect(screen.getByText('Test error message')).toBeVisible();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    removeMantineRandomAttributes();
    // Delete element with data-testid="stackTrace" because it has random text content
    const stackTraceElement = document.body.querySelector('[data-testid="stackTrace"]');
    if (stackTraceElement) {
      stackTraceElement.remove();
    }
    expect(asFragment()).toMatchSnapshot();
  });
});
