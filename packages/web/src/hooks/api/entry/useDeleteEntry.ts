import { useMutation, useQueryClient } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';

async function deleteEntry(entry: Entry) {
  return http<Entry>(`/api/entries/${entry.id}`, {
    method: 'DELETE',
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  const query = useMutation((entry: Entry) => deleteEntry(entry), {
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
