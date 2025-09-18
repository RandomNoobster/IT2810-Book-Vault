import { useSearchParams } from 'react-router-dom';
import { Center, Group, Pagination } from '@mantine/core';
import { getPaginationParams } from '@/utils/pagination';

type PaginationControllerProps = {
  totalBooks?: number;
};

/**
 * Controls pagination for book listings, updating URL parameters on page changes.
 */
const PaginationController = ({ totalBooks }: PaginationControllerProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit } = getPaginationParams(searchParams);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <>
      <Center>
        <Pagination.Root
          total={Math.max(Math.ceil((totalBooks ?? 0) / limit), 1)}
          value={page}
          onChange={handlePageChange}
          my="md"
        >
          <Group gap="xs">
            <Pagination.Previous aria-label="Previous Page" />
            <Pagination.Items />
            <Pagination.Next aria-label="Next Page" />
          </Group>
        </Pagination.Root>
      </Center>
    </>
  );
};

export default PaginationController;
