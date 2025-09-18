import { Review as ReviewType } from '@/generated/graphql';
import BookReviewCard from '../BookReviewCard/BookReviewCard';
import ProfileReviewCard from '../ProfileReviewCard/ProfileReviewCard';
import YourReviewCard from '../YourReviewCard/YourReviewCard';

type ReviewProps = {
  review: ReviewType;
  type: 'profileReview' | 'bookReview' | 'yourReview';
};

/**
 * A component that renders different types of review cards based on the specified type.
 * Supports profile reviews, book reviews, and user's own reviews.
 */
const ReviewCard = ({ review, type }: ReviewProps) => {
  if (type === 'yourReview') {
    return <YourReviewCard review={review} />;
  }

  if (type === 'profileReview') {
    return <ProfileReviewCard review={review} />;
  }

  if (type === 'bookReview' && review.book) {
    return <BookReviewCard review={review} />;
  }
};

export default ReviewCard;
