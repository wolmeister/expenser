import { useQuery } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';

async function getEntries() {
  return http<Entry[]>('/api/entries');
}

export function useEntries() {
  const query = useQuery('entries', () => getEntries());

  return {
    entries: query.data,
    isEntriesLoading: query.isLoading,
    isEntriesError: query.isError,
  };
}
