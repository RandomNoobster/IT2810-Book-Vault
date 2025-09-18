import { useEffect, useState } from 'react';
import { IconAdjustments, IconLayoutGrid, IconList } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { ActionIcon, Container, Flex, Group, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { FindYourNextBookAnimatedText } from '@/components/AnimatedText/AnimatedText';
import BookCardGrid from '@/components/BookCardGrid/BookCardGrid';
import EntriesController from '@/components/EntriesController/EntriesController';
import { Error404 } from '@/components/ErrorPage/ErrorPage';
import LoadingCircle from '@/components/Loading/Loading';
import PaginationController from '@/components/PaginationController/PaginationController';
import SearchConfiguration from '@/components/SearchConfiguration/SearchConfiguration';
import SearchContainer from '@/components/SearchContainer/SearchContainer';
import { useBooks } from '@/hooks/useBooks';
import { getFilterParams } from '@/utils/filters';
import { formatNumberWithSpaces } from '@/utils/formatting';
import { getPaginationParams } from '@/utils/pagination';
import { getSearchParams } from '@/utils/search';
import { isValidUrlParams } from '@/utils/validateUrlParams';
import styles from './BookList.module.css';

/**
 * BookList component displays a list of books with filtering, sorting, and pagination.
 * This component only considers the URL query parameters when determining the filters.
 * If another component want to affect the filters, it should change the URL query parameters.
 */
export function BookList() {
  const [searchParams] = useSearchParams();
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const [opened, { open, close }] = useDisclosure(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Extract filter, pagination, and search parameters from URL search params
  const {
    sortBy,
    sortOrder,
    genres,
    authors,
    publishers,
    beforeDate,
    afterDate,
    minPages,
    maxPages,
    minRating,
  } = getFilterParams(searchParams);
  const { page, limit } = getPaginationParams(searchParams);
  const { searchValue } = getSearchParams(searchParams);

  // Fetch books based on filter, pagination, and search parameters
  const {
    books: books,
    totalBooks,
    loading: booksLoading,
    error: booksError,
  } = useBooks({
    limit,
    page,
    search: searchValue,
    sortBy,
    sortOrder,
    beforeDate,
    afterDate,
    authors,
    genres,
    publishers,
    minPages,
    maxPages,
    minRating,
  });

  // Format total number of books with spaces as thousand separators
  const formattedTotalBooks = totalBooks != null ? formatNumberWithSpaces(totalBooks) : '';

  useEffect(() => {
    close();
  }, [isDesktop]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (!isValidUrlParams(searchParams)) {
    return (
      <Error404
        title="Invalid search parameters"
        description="It looks like the search parameters in the URL are incorrect. Please check and try again."
        link="/books"
      />
    );
  }

  if (isDesktop == null) {
    return <LoadingCircle />;
  }

  return (
    <>
      <FindYourNextBookAnimatedText />

      {!isDesktop && <SearchConfiguration useDrawer opened={opened} close={close} />}

      <Group justify="center" align="flex-end" gap="sm" wrap="nowrap" my="sm">
        <SearchContainer />
        {!isDesktop && (
          <ActionIcon onClick={open} size="lg" aria-label="Open search configuration" mb={1}>
            <IconAdjustments size="75%" />
          </ActionIcon>
        )}
      </Group>

      <Flex justify="space-between" align="flex-end" gap="md">
        <Text data-testid="number-of-results">
          {booksLoading ? 'Loading...' : `${formattedTotalBooks} results`}
        </Text>
        <Flex align="flex-end" gap="xs">
          <EntriesController />
          <ActionIcon
            onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
            size="input-sm"
            variant="default"
            title="Toggle view"
          >
            {viewType === 'list' ? <IconList size="75%" /> : <IconLayoutGrid size="75%" />}
          </ActionIcon>
        </Flex>
      </Flex>

      <Flex gap="lg" my="lg">
        {isDesktop && (
          <Container flex={0} px={0} className={styles.filterContainer}>
            <SearchConfiguration useDrawer={false} />
          </Container>
        )}
        <Container flex={1} px={0}>
          <BookCardGrid
            books={books}
            loading={booksLoading}
            error={booksError}
            viewType={viewType}
          />
        </Container>
      </Flex>

      <PaginationController totalBooks={totalBooks} />
    </>
  );
}
