import { gql } from '@/generated';

/** Mutation to create a new user */
export const CREATE_USER = gql(`
  mutation CreateUser {
    createUser {
      UUID
      secret
    }
  }
`);

export const UPDATE_USER = gql(`
  mutation UpdateUser($input: UpdateUsernameInput!) {
    updateUser(input: $input) {
      user {
        UUID
        name
      }
      success
      message
    }
  }
`);

export const UPDATE_USERLIBARY = gql(`
  mutation UpdateUserLibrary($input: UpdateUserLibraryInput!) {
    updateUserLibrary(input: $input) {
      success
      message
    }
  }
`);
