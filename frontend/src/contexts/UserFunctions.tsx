import { useContext } from 'react';
import { UserContext } from './UserContext';

/**
 * Custom hook to access the UserContext.
 * @returns {UserContextProps} The user context value containing user info and setter
 *     - info: The user info object
 *     - setUser: Function to set the user info
 * @throws {Error} If used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a FavoritesProvider');
  }
  return context;
};
