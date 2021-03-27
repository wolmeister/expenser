import { useMutation, useQueryClient } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';
import { useAuth } from '../../useAuth';

async function deleteEntry(entry: Entry, token: string | null) {
  return http<Entry>(`/api/entries/${entry.id}`, {
    method: 'DELETE',
    token,
  });
}

export function useDeleteEntry() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const query = useMutation((entry: Entry) => deleteEntry(entry, token), {
    async onSuccess(entry) {
      await queryClient.invalidateQueries('entries');
      await queryClient.invalidateQueries(['entry', entry.id]);
    },
  });

  return {
    deleteEntry: query.mutate,
    deleteEntryAsync: query.mutateAsync,
    isDeleteEntryLoading: query.isLoading,
    isDeleteEntryError: query.isError,
  };
}
