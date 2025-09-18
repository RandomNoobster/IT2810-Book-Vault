import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { TextInput } from '@mantine/core';
import { getHotkeyHandler, useDebouncedCallback } from '@mantine/hooks';
import { DEFAULT_PAGE } from '@/utils/pagination';
import { updateQueryParams } from '@/utils/queryParams';
import { getSearchParams } from '@/utils/search';
import styles from './SearchContainer.module.css';

/**
 * Provides a search input field with debounced search functionality.
 * Changes the URL query parameter 'search' as the user types in the input field.
 */
const SearchContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchValue: initialSearchValue } = getSearchParams(searchParams);
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  const performSearch = (searchValue: string) => {
    const oldSearchValue = getSearchParams(searchParams).searchValue;
    if (oldSearchValue !== searchValue) {
      updateQueryParams(setSearchParams, 'page', DEFAULT_PAGE.toString());
      updateQueryParams(setSearchParams, 'search', searchValue);
    }
  };

  const debouncedPerformSearch = useDebouncedCallback(async (searchValue: string) => {
    performSearch(searchValue);
  }, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    debouncedPerformSearch(event.target.value);
  };

  return (
    <TextInput
      placeholder="Search for books"
      leftSection={<IconSearch aria-label="Search icon" />}
      value={searchValue}
      onInput={handleChange}
      onKeyDown={getHotkeyHandler([['Enter', () => performSearch(searchValue)]])}
      label="Search by title and description"
      classNames={{ label: styles.label }}
      w="100%"
      maw={450}
    />
  );
};

export default SearchContainer;
