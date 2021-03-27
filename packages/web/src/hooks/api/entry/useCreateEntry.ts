import { useMutation, useQueryClient } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';
import { useAuth } from '../../useAuth';

async function createEntry(entry: Entry, token: string | null) {
  return http<Entry>('/api/entries', {
    body: entry,
    token,
  });
}

export function useCreateEntry() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const query = useMutation((entry: Entry) => createEntry(entry, token), {
    async onSuccess() {
      await queryClient.invalidateQueries('entries');
    },
  });

  return {
    createEntry: query.mutate,
    createEntryAsync: query.mutateAsync,
    isCreateEntryLoading: query.isLoading,
    isCreateEntryError: query.isError,
  };
}
