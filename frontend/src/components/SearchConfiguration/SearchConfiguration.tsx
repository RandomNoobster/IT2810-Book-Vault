import { useEffect, useState } from 'react';
import {
  IconBookOff,
  IconRestore,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import { abbreviateNumber } from 'js-abbreviation-number';
import { useSearchParams } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  ComboboxItem,
  Drawer,
  Group,
  InputLabel,
  LoadingOverlay,
  MultiSelect,
  MultiSelectProps,
  Radio,
  RangeSlider,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
} from '@mantine/core';
import { SortBy, SortOrder } from '@/generated/graphql';
import { useDateSpan } from '@/hooks/useDateSpan';
import { useFilterCount } from '@/hooks/useFilterCount';
import { useGenres } from '@/hooks/useGenres';
import { usePageSpan } from '@/hooks/usePageSpan';
import { DEFAULT_FILTERS, getFilterParams } from '@/utils/filters';
import { DEFAULT_PAGE } from '@/utils/pagination';
import { updateQueryParams } from '@/utils/queryParams';
import { getSearchParams } from '@/utils/search';
import styles from './SearchConfiguration.module.css';

type Updates = {
  [key: string]: string | string[];
};

type SearchConfigurationProps = {
  useDrawer: boolean;
  opened?: boolean;
  close?: () => void;
};

type renderMultiSelectOptionProps = {
  option: ComboboxItem;
  count: number | undefined;
};

const renderMultiSelectOption = ({ option, count }: renderMultiSelectOptionProps) => {
  return (
    <Group wrap="nowrap" justify="space-between" className={styles.fullWidth}>
      <Text size="sm">{option.value}</Text>
      <Text size="xs" ta="right" c="dimmed" miw={30}>
        {abbreviateNumber(count ?? 0)}
      </Text>
    </Group>
  );
};

const pageScale = (v: number) => 0.2 * v ** 3;
const inversePageScale = (v: number) => (v / 0.2) ** (1 / 3);
const pageSliderStepSize = 0.5;
const yearSliderStepSize = 1;

const generateMarks = (
  minimum: number,
  maximum: number,
  step: number,
  scaleFunc: (v: number) => number,
  inverseScaleFunc: (v: number) => number
) => {
  const marks: { value: number; label: string }[] = [];

  const minValue = Math.round(inverseScaleFunc(minimum) * 10) / 10;
  const maxValue = Math.round(inverseScaleFunc(maximum) * 10) / 10;

  const sliderSteps = 4;
  for (let i = 0; i <= sliderSteps; i++) {
    const sliderValue =
      Math.round((i * (maxValue - minValue)) / (sliderSteps * step)) * step + minValue;
    const pageCount = Math.round(scaleFunc(sliderValue));

    marks.push({
      value: sliderValue,
      label: `${pageCount}`,
    });
  }

  return marks;
};

/**
 * Advanced search configuration component with filters for sorting, publishers, authors,
 * ratings, publication year, page count, and genres. Can be rendered inline or in a drawer.
 */
const SearchConfiguration = ({ useDrawer, opened, close }: SearchConfigurationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { earliestDate, latestDate, loading: dateSpanLoading } = useDateSpan();
  const { leastPages, mostPages, loading: pageSpanLoading } = usePageSpan();
  const { genres: genreOptions, loading: loadingGenres, error: errorGenres } = useGenres();

  const {
    sortBy: initialSortBy,
    sortOrder: initialSortOrder,
    genres: initialGenres,
    publishers: initialPublishers,
    authors: initialAuthors,
    beforeDate: initialBeforeDate,
    afterDate: initialAfterDate,
    minPages: initialMinPages,
    maxPages: initialMaxPages,
    minRating: initialMinRating,
  } = getFilterParams(searchParams);

  const { searchValue } = getSearchParams(searchParams);

  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenres);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>(initialPublishers);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(initialAuthors);
  const [selectedBeforeDate, setSelectedBeforeDate] = useState<Date>(initialBeforeDate);
  const [selectedAfterDate, setSelectedAfterDate] = useState<Date>(initialAfterDate);
  const [selectedMinPages, setSelectedMinPages] = useState<number | undefined>(initialMinPages);
  const [selectedMaxPages, setSelectedMaxPages] = useState<number | undefined>(initialMaxPages);
  const [selectedMinRating, setSelectedMinRating] = useState<number | undefined>(initialMinRating);
  const [updates, setUpdates] = useState<Updates>({});
  const [shouldUpdateParams, setShouldUpdateParams] = useState(false);

  const [yearSliderSelectedMin, setYearSliderSelectedMin] = useState(
    selectedAfterDate.getFullYear()
  );
  const [yearSliderSelectedMax, setYearSliderSelectedMax] = useState(
    selectedBeforeDate.getFullYear()
  );
  const [pageSliderSelectedMin, setPageSliderSelectedMin] = useState(selectedMinPages);
  const [pageSliderSelectedMax, setPageSliderSelectedMax] = useState(selectedMaxPages);

  const {
    filterCount: filterCount,
    loading: filterCountLoading,
    error: errorFilterCount,
  } = useFilterCount({
    search: searchValue,
    beforeDate: selectedBeforeDate,
    afterDate: selectedAfterDate,
    authors: selectedAuthors,
    genres: selectedGenres,
    publishers: selectedPublishers,
    minPages: selectedMinPages,
    maxPages: selectedMaxPages,
    minRating: selectedMinRating,
  });

  const [authorLimit, setAuthorLimit] = useState(30);
  const [publisherLimit, setPublisherLimit] = useState(30);

  useEffect(() => {
    setAuthorLimit(30);
    setPublisherLimit(30);
  }, []);

  // Update search params. If useDrawer is true, we wait to apply the changes until the drawer is closed
  useEffect(() => {
    if (shouldUpdateParams && !useDrawer) {
      updateParameters();
      setShouldUpdateParams(false);
    }
  }, [shouldUpdateParams, useDrawer]);

  if (useDrawer && (close == null || opened == null)) {
    throw new Error('open and close functions must be provided when useDrawer is true');
  }

  const handleParamsChange = (key: string, value: undefined | string | string[]) => {
    setUpdates((current) => ({ ...current, [key]: value ?? '' }));
    setShouldUpdateParams(true);
  };

  const updateParameters = () => {
    if (Object.keys(updates).length !== 0) {
      updateQueryParams(setSearchParams, 'page', DEFAULT_PAGE.toString());
      Object.entries(updates).forEach(([key, value]) => {
        updateQueryParams(setSearchParams, key, value);
      });
      setUpdates({});
    }
  };

  const handleGenreChange = (genre: string, isChecked: boolean) => {
    const newSelection = isChecked
      ? [...selectedGenres, genre]
      : selectedGenres.filter((g) => g !== genre);
    setSelectedGenres(newSelection);
    handleParamsChange('genres', newSelection);
  };

  const authorsData = filterCount?.authors.reduce<Record<string, number>>((acc, author) => {
    acc[author.name] = author.count;
    return acc;
  }, {});

  const publishersData = filterCount?.publishers.reduce<Record<string, number>>(
    (acc, publisher) => {
      acc[publisher.name] = publisher.count;
      return acc;
    },
    {}
  );

  const genresData = filterCount?.genres.reduce<Record<string, number>>((acc, genre) => {
    acc[genre.name] = genre.count;
    return acc;
  }, {});

  const renderAuthorOption: MultiSelectProps['renderOption'] = ({ option }) =>
    renderMultiSelectOption({
      option,
      count: authorsData?.[option.value],
    });

  const renderPublisherOption: MultiSelectProps['renderOption'] = ({ option }) =>
    renderMultiSelectOption({
      option,
      count: publishersData?.[option.value],
    });

  let content;

  if (errorFilterCount) {
    content = (
      <Group justify="center" align="center" className={styles.noResultWrapper}>
        <IconBookOff />
        <Text size="xl" fw={700} my="xl">
          Error fetching filters
        </Text>
        <Text size="sm">{errorFilterCount?.message}</Text>
      </Group>
    );
  } else {
    content = (
      <Box pos="relative">
        <Group gap="sm" wrap="nowrap">
          <Select
            label="Sort by"
            flex={1}
            data={[
              { label: 'Book name', value: SortBy.BookName },
              { label: 'Author name', value: SortBy.AuthorName },
              { label: 'Publisher name', value: SortBy.PublisherName },
            ]}
            value={sortBy}
            onChange={(value) => {
              setSortBy(value as SortBy);
              handleParamsChange('sortBy', value as string);
            }}
            allowDeselect={false}
          />
          <ActionIcon
            mt="auto"
            aria-label="Sort order"
            onClick={() => {
              const newSortOrder = sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
              setSortOrder(newSortOrder);
              handleParamsChange('sortOrder', newSortOrder);
            }}
            size="lg"
          >
            <IconSortAscendingLetters
              aria-label="Ascending order"
              display={sortOrder === SortOrder.Asc ? 'inline' : 'none'}
              size="75%"
            />
            <IconSortDescendingLetters
              aria-label="Descending order"
              display={sortOrder === SortOrder.Desc ? 'inline' : 'none'}
              size="75%"
            />
          </ActionIcon>
        </Group>
        <MultiSelect
          classNames={{ root: styles.multiSelect }}
          label="Publisher"
          placeholder="Pick value"
          data={filterCount?.publishers.map((publisher) => publisher.name)}
          renderOption={renderPublisherOption}
          hidePickedOptions
          limit={publisherLimit}
          value={selectedPublishers}
          onChange={(value) => {
            setSelectedPublishers(value);
            handleParamsChange('publishers', value);
          }}
          scrollAreaProps={{
            onBottomReached: () => setPublisherLimit((prevLimit) => prevLimit + 20),
          }}
          searchable
          clearable
          nothingFoundMessage="No publisher matches your search"
        />
        <MultiSelect
          classNames={{ root: styles.multiSelect }}
          label="Authors"
          placeholder="Pick value"
          data={filterCount?.authors.map((author) => author.name)}
          renderOption={renderAuthorOption}
          hidePickedOptions
          limit={authorLimit}
          value={selectedAuthors}
          onChange={(value) => {
            setSelectedAuthors(value);
            handleParamsChange('authors', value);
          }}
          scrollAreaProps={{
            onBottomReached: () => setAuthorLimit((prevLimit) => prevLimit + 20),
          }}
          searchable
          clearable
          nothingFoundMessage="No author matches your search"
        />

        <Radio.Group
          mt={20}
          name="Minimum rating"
          label="Minimum rating"
          value={selectedMinRating?.toString() ?? '0'}
          onChange={(rating) => {
            setSelectedMinRating(parseInt(rating, 10));
            handleParamsChange('minRating', rating.toString());
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <Radio
              classNames={{
                body: styles.radioBody,
              }}
              radius="md"
              key={rating}
              checked={rating === selectedMinRating}
              value={rating.toString()}
              disabled={(filterCount?.ratings.find((r) => r.rating === rating)?.count ?? 0) === 0}
              label={
                <Group wrap="nowrap" justify="space-between" className={styles.fullWidth}>
                  <Group wrap="nowrap">
                    {Array.from({ length: rating }, (_, i) => (
                      <IconStarFilled key={i} color="orange" />
                    ))}
                    {Array.from({ length: 5 - rating }, (_, i) => (
                      <IconStar key={5 + i} color="orange" />
                    ))}
                  </Group>
                  <Text className={styles.description}>
                    {abbreviateNumber(
                      filterCount?.ratings.find((r) => r.rating === rating)?.count ?? 0
                    )}
                  </Text>
                </Group>
              }
            />
          ))}
        </Radio.Group>
        <Box pos="relative">
          <LoadingOverlay
            visible={dateSpanLoading && !filterCountLoading}
            zIndex={90}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          <InputLabel mt={20}>Year published</InputLabel>
          <RangeSlider
            classNames={{ trackContainer: styles.trackContainer, markLabel: styles.markLabel }}
            thumbFromLabel="Thumb for earliest publish date"
            thumbToLabel="Thumb for latest publish date"
            min={earliestDate}
            max={latestDate}
            minRange={10}
            step={yearSliderStepSize}
            marks={generateMarks(
              earliestDate,
              latestDate,
              yearSliderStepSize,
              (v) => v,
              (v) => v
            )}
            defaultValue={[earliestDate, latestDate]}
            value={[yearSliderSelectedMin, yearSliderSelectedMax]}
            onChange={(value) => {
              setYearSliderSelectedMin(value[0]);
              setYearSliderSelectedMax(value[1]);
            }}
            onChangeEnd={(value) => {
              setSelectedAfterDate(new Date(value[0], 0, 1));
              setSelectedBeforeDate(new Date(value[1], 11, 31));
              handleParamsChange('afterDate', new Date(value[0], 0, 1).toISOString());
              handleParamsChange('beforeDate', new Date(value[1], 11, 31).toISOString());
            }}
          />
        </Box>
        <Box pos="relative">
          <LoadingOverlay
            visible={pageSpanLoading && !filterCountLoading}
            zIndex={90}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          <InputLabel mt={40}>Number of pages</InputLabel>
          <RangeSlider
            scale={(v: number) => Math.round(pageScale(v))}
            classNames={{ trackContainer: styles.trackContainer, markLabel: styles.markLabel }}
            thumbFromLabel="Thumb for least number of pages"
            thumbToLabel="Thumb for most number of pages"
            min={inversePageScale(leastPages)}
            max={inversePageScale(mostPages)}
            minRange={3}
            step={pageSliderStepSize}
            marks={generateMarks(
              leastPages,
              mostPages,
              pageSliderStepSize,
              pageScale,
              inversePageScale
            )}
            defaultValue={[
              inversePageScale(pageSliderSelectedMin ?? leastPages),
              inversePageScale(pageSliderSelectedMin ?? mostPages),
            ]}
            value={[
              inversePageScale(pageSliderSelectedMin ?? leastPages),
              inversePageScale(pageSliderSelectedMax ?? mostPages),
            ]}
            onChange={(value) => {
              setPageSliderSelectedMin(Math.round(pageScale(value[0])));
              setPageSliderSelectedMax(Math.round(pageScale(value[1])));
            }}
            onChangeEnd={(value) => {
              const scaledMinPages = Math.round(pageScale(value[0]));
              const scaledMaxPages = Math.round(pageScale(value[1]));
              setSelectedMinPages(scaledMinPages);
              setSelectedMaxPages(scaledMaxPages);
              handleParamsChange('minPages', scaledMinPages.toString());
              handleParamsChange('maxPages', scaledMaxPages.toString());
            }}
          />
        </Box>
        <InputLabel mt={40}>Genres</InputLabel>
        <SimpleGrid cols={2} mt="xs">
          {
            // Show skeleton if genres are loading
            // Show error message if genres failed to load
            // Show genre checkboxes otherwise
            loadingGenres ? (
              Array(16)
                .fill(0)
                .map((_, i) => <Skeleton key={i} height={28} mb="sm" />)
            ) : errorGenres || genreOptions == null ? (
              <Text>Unable to load genre filters.</Text>
            ) : (
              genreOptions.map((genre) => (
                <Checkbox
                  key={genre.name}
                  value={genre.name}
                  label={genre.name}
                  checked={selectedGenres.includes(genre.name)}
                  description={
                    genresData?.[genre.name] != null
                      ? abbreviateNumber(genresData[genre.name])
                      : '0'
                  }
                  onChange={(event) => handleGenreChange(genre.name, event.target.checked)}
                  disabled={(genresData?.[genre.name] ?? 0) === 0}
                />
              ))
            )
          }
        </SimpleGrid>
        <Center mt="lg">
          <Button
            leftSection={<IconRestore />}
            variant="default"
            onClick={() => {
              setSortBy(DEFAULT_FILTERS.sortBy);
              setSortOrder(DEFAULT_FILTERS.sortOrder);
              setSelectedGenres(DEFAULT_FILTERS.selectedGenres);
              setSelectedPublishers(DEFAULT_FILTERS.selectedPublishers);
              setSelectedAuthors(DEFAULT_FILTERS.selectedAuthors);
              setSelectedAfterDate(DEFAULT_FILTERS.selectedAfterDate);
              setSelectedBeforeDate(DEFAULT_FILTERS.selectedBeforeDate);
              setSelectedMinPages(DEFAULT_FILTERS.selectedMinPages);
              setSelectedMaxPages(DEFAULT_FILTERS.selectedMaxPages);
              setSelectedMinRating(DEFAULT_FILTERS.selectedMinRating);
              setUpdates({
                sortBy: DEFAULT_FILTERS.sortBy,
                sortOrder: DEFAULT_FILTERS.sortOrder,
                genres: DEFAULT_FILTERS.selectedGenres,
                publishers: DEFAULT_FILTERS.selectedPublishers,
                authors: DEFAULT_FILTERS.selectedAuthors,
                beforeDate: DEFAULT_FILTERS.selectedBeforeDate.toISOString(),
                afterDate: DEFAULT_FILTERS.selectedAfterDate.toISOString(),
                minPages: DEFAULT_FILTERS.selectedMinPages ?? '',
                maxPages: DEFAULT_FILTERS.selectedMaxPages ?? '',
                minRating: DEFAULT_FILTERS.selectedMinRating ?? '',
              });
              setShouldUpdateParams(true);
              setYearSliderSelectedMin(DEFAULT_FILTERS.selectedAfterDate.getFullYear());
              setYearSliderSelectedMax(DEFAULT_FILTERS.selectedBeforeDate.getFullYear());
              setPageSliderSelectedMin(DEFAULT_FILTERS.selectedMinPages);
              setPageSliderSelectedMax(DEFAULT_FILTERS.selectedMaxPages);
            }}
          >
            Reset filters to default values
          </Button>
        </Center>
      </Box>
    );
  }

  if (useDrawer && opened != null && close != null) {
    return (
      <Drawer
        opened={opened}
        onClose={() => {
          updateParameters();
          close();
        }}
        title="Configure your search"
      >
        {content}
      </Drawer>
    );
  }

  return content;
};

export default SearchConfiguration;
