import { Stack } from '@mantine/core';
import { HeroHeader } from '@/components/HeroHeader/HeroHeader';
import PopularGenres from '@/components/PopularGenres/PopularGenres';
import { StatsGroup } from '@/components/StatsGroup/StatsGroup';

/**
 * HomePage component serves as the landing page of the application.
 */
export function HomePage() {
  return (
    <>
      <Stack gap="xl">
        <HeroHeader />
        <StatsGroup />
        <PopularGenres />
      </Stack>
    </>
  );
}
