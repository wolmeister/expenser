import { useMutation, useQueryClient } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';
import { useAuth } from '../../useAuth';

async function updateEntry(entry: Entry, token: string | null) {
  return http<Entry>(`/api/entries/${entry.id}`, {
    method: 'PUT',
    body: entry,
    token,
  });
}

export function useUpdateEntry() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const query = useMutation((entry: Entry) => updateEntry(entry, token), {
    async onSuccess(entry) {
      await queryClient.invalidateQueries('entries');
      await queryClient.invalidateQueries(['entry', entry.id]);
    },
  });

  return {
    updateEntry: query.mutate,
    updateEntryAsync: query.mutateAsync,
    isUpdateEntryLoading: query.isLoading,
    isUpdateEntryError: query.isError,
  };
}
