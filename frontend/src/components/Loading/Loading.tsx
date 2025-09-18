import { forwardRef } from 'react';
import { Image, Loader, LoaderProps, MantineLoaderComponent, Stack, Text } from '@mantine/core';
import BookLoaderGif from '../../assets/BookLoader.gif';
import styles from './Loading.module.css';

/** Define a new Mantine Loader. This will be used in theme.ts, such that the Loading component below has access to this and we follow Mantine best practices */
export const BookLoader: MantineLoaderComponent = forwardRef(({ style, ...others }, ref) => (
  <Image
    src={BookLoaderGif}
    {...others}
    className={`${styles.icon} ${others.className}`}
    ref={ref}
    style={{
      width: 'var(--loader-size)',
      height: 'var(--loader-size)',
      stroke: 'var(--loader-color)',
      ...style,
    }}
    alt="Loading"
  />
));

/**
 * Loading component which has custom styling which you can use directly.
 * Displays a flipping book as a loader.
 */
const Loading = (props: LoaderProps) => {
  return (
    <Stack my={100} justify="center" align="center">
      <Loader size="xxl" {...props} type="book" />
      <Text fw={500}>Loading</Text>
    </Stack>
  );
};

export default Loading;
