import { render, screen } from '@test-utils';
import { describe, expect, it } from 'vitest';
import { dummyBook } from '../../../test-utils/testVars';
import { Ratings } from './Ratings';

describe('Ratings component', () => {
  const book = dummyBook;

  it('renders the rating correctly', () => {
    render(<Ratings book={book} />);
    const ratingElement = screen.getByText('3.6');
    expect(ratingElement).toBeInTheDocument();
  });

  it('renders the number of ratings correctly', () => {
    render(<Ratings book={book} />);
    const numRatingsElement = screen.getByText('(5 000 ratings)');
    expect(numRatingsElement).toBeInTheDocument();
  });
});
