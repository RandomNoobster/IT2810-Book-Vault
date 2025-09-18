import { CSSProperties, useMemo } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Box, useMantineTheme } from '@mantine/core';
import { useElementSize, useMediaQuery } from '@mantine/hooks';

type AnimatedTextProps = {
  sequence: (string | number)[];
  ariaLabel: string;
};

// Cannot use css file, since we need the style to preemtively calculate the width of the text
// so that we can reserve the space, to avoid layout shifts
const animatedStyle: CSSProperties = {
  fontSize: 'calc(var(--mantine-font-size-md) * 2)',
  fontWeight: 600,
  display: 'block',
  margin: 0,
};

const getTextDimensions = (text: string, containerWidth: number, style: CSSProperties) => {
  // This does not actually create a DOM element, so the user will never see this
  // This is a hacky way to calculate the width accurately with CSS variables that change at runtime
  const tempContainer = document.createElement('h1');
  Object.assign(tempContainer.style, {
    ...style,
    visibility: 'hidden',
    position: 'absolute',
    width: `${containerWidth}px`,
  });

  const span = document.createElement('span');
  span.textContent = text;
  tempContainer.appendChild(span);

  // Add to DOM temporarily to get computed width
  document.body.appendChild(tempContainer);
  const width = span.getBoundingClientRect().width;
  const height = span.getBoundingClientRect().height;

  // Cleanup
  document.body.removeChild(tempContainer);

  return { width, height };
};

export const AnimatedText = ({ sequence, ariaLabel }: AnimatedTextProps) => {
  const { ref, width: elementWidth } = useElementSize();
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);

  const updatedAnimatedStyle: CSSProperties = useMemo(() => {
    return {
      ...animatedStyle,
      textAlign: isDesktop ? 'center' : 'left',
    };
  }, [isDesktop]);

  // Get the longest string in sequence (ignore numbers)
  const longestString = useMemo(() => {
    return sequence.reduce((longest: string, item) => {
      if (typeof item === 'string' && item.length > longest.length) {
        return item;
      }
      return longest;
    }, '');
  }, [sequence]);

  const { height } = useMemo(() => {
    return getTextDimensions(
      longestString,
      elementWidth || window.innerWidth - 80, // Fallback to avoid layout shift when useElementSize is loading (approximation)
      updatedAnimatedStyle
    );
  }, [longestString, elementWidth, isDesktop]);

  // For error margin
  const adjustedHeight = height * 1.15;

  if (isDesktop == null) {
    return <></>;
  }

  return (
    <Box ref={ref} w="100%" h={adjustedHeight} mt="sm" mb="xl">
      <TypeAnimation
        aria-label={ariaLabel}
        sequence={sequence}
        wrapper="h1"
        speed={50}
        repeat={Infinity}
        style={updatedAnimatedStyle}
      />
    </Box>
  );
};

const waitTime = 5000;
const findYourNextBookSequence = [
  'Find your next favorite action book',
  waitTime,
  'Find your next favorite comic book',
  waitTime,
  'Find your next favorite drama book',
  waitTime,
  'Find your next favorite horror book',
  waitTime,
  'Find your next favorite fantasy book',
  waitTime,
];

export const FindYourNextBookAnimatedText = () => {
  return (
    <AnimatedText sequence={findYourNextBookSequence} ariaLabel="Find your next favorite book" />
  );
};
