import { useSearchParams } from 'react-router-dom';
import { Container, Flex, Text, Title } from '@mantine/core';
import BookCardGrid from '@/components/BookCardGrid/BookCardGrid';
import EntriesController from '@/components/EntriesController/EntriesController';
import { Error404 } from '@/components/ErrorPage/ErrorPage';
import LoadingBook from '@/components/Loading/Loading';
import PaginationController from '@/components/PaginationController/PaginationController';
import { useUser } from '@/contexts/UserFunctions';
import { SortBy, SortOrder } from '@/generated/graphql';
import { useBooks } from '@/hooks/useBooks';
import { formatNumberWithSpaces } from '@/utils/formatting';
import { getPaginationParams } from '@/utils/pagination';
import { isValidUrlParams } from '@/utils/validateUrlParams';

export function WantToReadList() {
  const [searchParams] = useSearchParams();
  const { page, limit } = getPaginationParams(searchParams);

  const userUUID = useUser().info.UUID;

  const { books, totalBooks, loading, error } = useBooks({
    limit,
    page,
    sortBy: SortBy.WantToRead,
    sortOrder: SortOrder.Desc,
    wantToReadListUserUUID: userUUID,
  });

  const formattedTotal = totalBooks != null ? formatNumberWithSpaces(totalBooks) : '';

  if (!isValidUrlParams(searchParams)) {
    return (
      <Error404
        title="Invalid search parameters"
        description="It looks like the search parameters in the URL are incorrect. Please check and try again."
        link="/books"
      />
    );
  }

  if (error) {
    return (
      <Error404
        title="Error fetching books"
        description="Something went wrong fetching books you want to read."
        link="/books"
      />
    );
  }

  if (loading) {
    return <LoadingBook />;
  }

  return (
    <>
      <Title order={1} mt="lg">
        Books you want to read
      </Title>

      <Flex justify="space-between" align="flex-end" gap="md">
        <Text>{loading ? 'Loading...' : `${formattedTotal} results`}</Text>
        <EntriesController />
      </Flex>

      <Flex gap="lg" my="lg">
        <Container flex={1} px={0}>
          <BookCardGrid books={books} loading={loading} error={error} viewType="grid" />{' '}
        </Container>
      </Flex>

      <PaginationController totalBooks={totalBooks} />
    </>
  );
}
