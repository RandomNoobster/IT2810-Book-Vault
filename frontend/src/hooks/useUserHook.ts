import { useQuery } from '@apollo/client';
import { GET_USER } from '@/graphql/queries/users';

type UseUserArgs = {
  UUID: string | null;
  secret: string | null;
};

/**
 * Custom hook that fetches a user by their UUID
 * @param {string} UUID - The UUID of the user to fetch
 * @returns Object containing:
 * - user: The user data if found
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const useUserHook = ({ UUID, secret }: UseUserArgs) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: UUID != null && secret != null ? { UUID, secret } : undefined, // Just to make TypeScript happy. The query will not execute if either of these are null.
    skip: UUID == null || secret == null,
  });

  return {
    user: data?.user,
    loading,
    error,
  };
};
