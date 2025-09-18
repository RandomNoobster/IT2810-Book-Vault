import { useSearchParams } from 'react-router-dom';
import { Select } from '@mantine/core';
import { getPaginationParams } from '@/utils/pagination';
import styles from './EntriesController.module.css';

/**
 * Controls the number of entries displayed per page through a select input.
 * Changes the URL query parameter 'limit' to the selected value.
 */
const EntriesController = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { limit, DEFAULT_LIMIT, LIMIT_OPTIONS } = getPaginationParams(searchParams);

  const handleEntiresLimitChange = (newLimit: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('limit', newLimit ?? DEFAULT_LIMIT.toString());
    setSearchParams(newParams);
  };

  return (
    <Select
      label="Entries"
      data={LIMIT_OPTIONS}
      allowDeselect={false}
      value={limit.toString()}
      onChange={handleEntiresLimitChange}
      aria-label="Number of entries"
      className={styles.select}
      data-testid="entries-select"
    />
  );
};

export default EntriesController;
