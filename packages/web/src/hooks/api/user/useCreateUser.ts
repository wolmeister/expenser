import { useMutation } from 'react-query';

import { http } from '../../../http';
import { User } from '../../../models/user';

async function createUser(user: User) {
  return http<User>('/users', {
    body: user,
  });
}

export function useCreateUser() {
  const query = useMutation((user: User) => createUser(user));

  return {
    createUser: query.mutate,
    createUserAsync: query.mutateAsync,
    isCreateUserLoading: query.isLoading,
    isCreateUserError: query.isError,
  };
}
