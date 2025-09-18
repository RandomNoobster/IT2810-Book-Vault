import {
  Container,
  createTheme,
  DEFAULT_THEME,
  Loader,
  MantineColorsTuple,
  rem,
} from '@mantine/core';
import { BookLoader } from './components/Loading/Loading';

const CONTAINER_SIZES: Record<string, string> = {
  xxs: '24em',
  xs: '30em',
  sm: '48em',
  md: '64em',
  lg: '75em',
  xl: '90em',
};

// https://colorkit.co/color-palette-generator/02070b-030a11-030d16-051321-06192b-092641-0c3256-0f3f6c-124b81-155896/
const darkBlue: MantineColorsTuple = [
  '#155896',
  '#124b81',
  '#0f3f6c',
  '#0c3256',
  '#092641',
  '#06192b',
  '#051321',
  '#030d16',
  '#030a11',
  '#02070b',
];

// https://colorkit.co/color-palette-generator/6a5f4a-d4bd94-dac5a1-e2d1b5-e9ddc8-eee4d3-f2eade-f6f0e7-f9f5ef-fcfaf7/
const beige: MantineColorsTuple = [
  '#fcfaf7',
  '#f9f5ef',
  '#f6f0e7',
  '#f2eade',
  '#eee4d3',
  '#e9ddc8',
  '#e2d1b5',
  '#dac5a1',
  '#d4bd94',
  '#6a5f4a',
];

export const resolver = () => ({
  variables: {},
  light: {
    '--mantine-color-dimmed': 'var(--mantine-color-dark-3)',
  },
  dark: {
    '--mantine-color-dimmed': 'var(--mantine-color-gray-5)',
  },
});

// Override the default theme with custom values
export const theme = createTheme({
  fontFamily: `Poppins, ${DEFAULT_THEME.fontFamily}`,
  breakpoints: {
    xxs: '24em', // 384px
    xs: '30em', // 480px
    sm: '48em', // 768px
    md: '64em', // 1024px
    lg: '75em', // 1200px
    xl: '90em', // 1440px
  },
  colors: {
    'dark-blue': darkBlue,
    beige,
  },
  cursorType: 'pointer',
  primaryShade: 8,
  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, book: BookLoader },
      },
      vars: (_, props) => {
        if (props.size === 'xxl') {
          return {
            root: {
              '--loader-size': rem(90),
            },
          };
        }
        return { root: {} };
      },
    }),
  },
});
