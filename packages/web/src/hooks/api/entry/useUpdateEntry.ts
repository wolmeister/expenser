import { useMutation, useQueryClient } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';

async function updateEntry(entry: Entry) {
  return http<Entry>(`/api/entries/${entry.id}`, {
    method: 'PUT',
    body: entry,
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();
  const query = useMutation((entry: Entry) => updateEntry(entry), {
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
