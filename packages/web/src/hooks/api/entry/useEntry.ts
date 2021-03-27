import { useQuery } from 'react-query';

import { http } from '../../../http';
import { Entry } from '../../../models/entry';
import { useAuth } from '../../useAuth';

async function getEntry(id: number, token: string | null) {
  return http<Entry>(`/api/entries/${id}`, { token });
}

export function useEntry(id: number) {
  const { token } = useAuth();
  const query = useQuery(['entries', id], () => getEntry(id, token));

  return {
    entry: query.data,
    isEntryLoading: query.isLoading,
    isEntryError: query.isError,
  };
}
