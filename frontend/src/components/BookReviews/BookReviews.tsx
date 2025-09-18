import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Flex } from '@mantine/core';
import { useUser } from '@/contexts/UserFunctions';
import { Review as ReviewType } from '@/generated/graphql';
import { GET_BOOK_REVIEWS } from '@/graphql/queries/reviews';
import ReviewStack from '../ReviewStack/ReviewStack';

type BookReviewsProps = {
  bookId: string;
  top: React.RefObject<HTMLDivElement>;
};

/**
 * Displays and manages a paginated list of reviews for a specific book.
 */
const BookReviews = ({ bookId, top }: BookReviewsProps) => {
  const [page, setPage] = useState(0);
  const [isLastPage, setLastPage] = useState(true);
  const [displayReviews, setDisplayReviews] = useState<ReviewType[]>([]);

  const UUID: string = useUser().info.UUID;

  const { loading: loadingDisplayReviews, fetchMore } = useQuery(GET_BOOK_REVIEWS, {
    variables: { bookID: bookId, limit: 3, offset: page, userUUID: UUID },
    onCompleted: (data) => {
      setDisplayReviews((old) => [...old, ...(data.bookReviews.reviews as ReviewType[])]);
      setLastPage(data.bookReviews.pagination.isLastPage);
    },
  });

  const loadMoreReviews = () => {
    // Disable loading more when waiting for other reviews
    if (!loadingDisplayReviews) {
      fetchMore({
        variables: { offset: page + 1 },
      });
      setPage((currentPage) => currentPage + 1);
    }
  };

  const scrollToTop = () => {
    if (top.current) {
      window.scrollTo({
        top: top.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <ReviewStack reviews={displayReviews} type="profileReview" />

      <Flex justify="center" align="center" gap="lg">
        {!isLastPage ? (
          <Button variant="filled" onClick={loadMoreReviews}>
            Load more
          </Button>
        ) : (
          <></>
        )}
        {displayReviews.length > 5 ? (
          <Button variant="filled" onClick={scrollToTop}>
            Scroll to top
          </Button>
        ) : (
          <></>
        )}
      </Flex>
    </>
  );
};

export default BookReviews;
