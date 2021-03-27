import { useQuery } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';
import { useAuth } from '../../useAuth';

async function getEntries(token: string | null) {
  return http<Entry[]>('/api/entries', { token });
}

export function useEntries() {
  const { token } = useAuth();
  const query = useQuery('entries', () => getEntries(token));

  return {
    entries: query.data,
    isEntriesLoading: query.isLoading,
    isEntriesError: query.isError,
  };
}
