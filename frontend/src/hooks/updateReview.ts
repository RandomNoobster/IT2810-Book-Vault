import { useMutation } from '@apollo/client';
import { UpdateReviewInput } from '@/generated/graphql';
import { UPDATE_REVIEW } from '@/graphql/mutations/reviews';

/**
 * Custom hook that handles review update functionality
 * @returns Object containing:
 * - submitUpdate: Function to update a review
 * - success: if the resolver handeled the mutation successfully
 * - message: message from resolver that gives the user a short explanation on how their data was updated (or not updated).
 * - loading: Boolean indicating if the mutation is in progress
 * - error: Any error that occurred during the mutation. This one is by apollo and should not be shown by user.
 */
export const updateReview = (userUUID: string) => {
  const [update, { data, loading, error }] = useMutation(UPDATE_REVIEW);

  const submitUpdate = async (input: UpdateReviewInput) => {
    try {
      await update({
        variables: { input },
        update: (cache, { data: mutationData }) => {
          if (mutationData?.updateReview.success) {
            // On update remove the bookReviews "focusUserUUID" queries from cache as
            // they are now stale
            const allKeys = cache.extract().ROOT_QUERY;

            Object.keys(allKeys).forEach((key) => {
              if (key.startsWith('bookReviews({"focusUserUUID"')) {
                const jsonString = key.replace('bookReviews(', '').replace(')', '');
                const parsed = JSON.parse(jsonString);
                const { limit, offset } = parsed;

                cache.evict({
                  id: 'ROOT_QUERY',
                  fieldName: 'bookReviews',
                  args: {
                    focusUserUUID: userUUID,
                    limit,
                    offset,
                  },
                });
              }
            });

            cache.gc();
          }
        },
      });
    } catch (e) {
      console.error('Error during update:', e);
    }
  };

  return {
    submitUpdate,
    success: data?.updateReview.success ?? !error,
    message: data?.updateReview.message ?? (error && 'Error updating review. Try again later.'),
    loading,
    error,
  };
};
