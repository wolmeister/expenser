import { useQuery } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';

async function getEntry(id: number) {
  return http<Entry>(`/entries/${id}`);
}

export function useEntry(id: number) {
  const query = useQuery(['entries', id], () => getEntry(id));

  return {
    entry: query.data,
    isEntryLoading: query.isLoading,
    isEntryError: query.isError,
  };
}
