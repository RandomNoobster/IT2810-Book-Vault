import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql/mutations/users';

/**
 * Custom hook that creates a new user.
 * @returns Object containing:
 * - user: The created user data or null
 * - loading: Boolean indicating if the mutation is in progress
 * - error: Any error that occurred during the mutation
 */
export const makeUser = () => {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  return {
    createUser,
    user: data?.createUser || null,
    loading,
    error,
  };
};
