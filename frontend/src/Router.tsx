import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage/ErrorPage';
import Layout from './components/Layout/Layout';
import Book from './pages/Book.page';
import { BookList } from './pages/BookList.page';
import { HaveReadList } from './pages/HaveReadList.page';
import { HomePage } from './pages/Home.page';
import { ReviewsList } from './pages/ReviewsList.page';
import Testing from './pages/Testing.page';
import UserProfile from './pages/UserProfile.page';
import { WantToReadList } from './pages/WantToReadList.page';

// Create a browser router using React Router V6
// The ScrollRestoration component is used to restore the scroll position when navigating between pages
const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: (
            <>
              <ScrollRestoration />
              <HomePage />
            </>
          ),
        },
        {
          path: '/books',
          element: (
            <>
              <ScrollRestoration
                getKey={(location, _) => {
                  return location.pathname;
                }}
              />
              <BookList />
            </>
          ),
        },
        {
          path: '/books/:bookId',
          element: (
            <>
              <ScrollRestoration />
              <Book />
            </>
          ),
        },
        {
          path: 'testing',
          element: (
            <>
              <ScrollRestoration />
              <Testing />
            </>
          ),
        },
        {
          path: '/profile',
          element: (
            <>
              <ScrollRestoration />
              <UserProfile />
            </>
          ),
        },
        {
          path: '/profile/myReviews',
          element: (
            <>
              <ScrollRestoration />
              <ReviewsList />
            </>
          ),
        },
        {
          path: '/profile/haveRead',
          element: (
            <>
              <ScrollRestoration />
              <HaveReadList />
            </>
          ),
        },
        {
          path: '/profile/wantToRead',
          element: (
            <>
              <ScrollRestoration />
              <WantToReadList />
            </>
          ),
        },
      ],
    },
  ],
  {
    basename: '/bookvault',
  }
);

export function Router() {
  return <RouterProvider router={router} />;
}
