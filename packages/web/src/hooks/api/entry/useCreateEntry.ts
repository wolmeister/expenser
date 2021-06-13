import { useMutation, useQueryClient } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';

async function createEntry(entry: Entry) {
  return http<Entry>('/entries', {
    body: entry,
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  const query = useMutation((entry: Entry) => createEntry(entry), {
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
