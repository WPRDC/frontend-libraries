import { ProjectIndex, ProjectIndexDetails, Watchlist, UserProfile } from '@wprdc-types/housecat';

import { HousecatAPI } from './api';

import { useQuery, UseQueryResult } from 'react-query';
import { APIMapBoxResponse } from '@wprdc-types/connections';
import { useProvider } from '@wprdc-components/provider';
import { DEFAULT_HOST } from './settings';

const staleTime = 1000 * 60 * 5;

export function usePublicHousingProject(
  projectID?: number | string | ProjectIndex,
): UseQueryResult<ProjectIndexDetails> {
  const { housecatHost } = useProvider();
  const api = new HousecatAPI(housecatHost || DEFAULT_HOST);

  let argID: number;
  if (typeof projectID === 'object') argID = projectID.id;
  else argID = parseInt(projectID as string);

  return useQuery<ProjectIndexDetails>(['projectDetails', argID], () =>
      api.requestAffordableHousingProject(argID),
    { enabled: !!projectID, staleTime },
  );
}

export function useWatchlist(slug?: string) {
  const { housecatHost } = useProvider();
  const api = new HousecatAPI(housecatHost || DEFAULT_HOST);

  return useQuery<Watchlist>(['projectWatchlist', slug], () =>
      api.requestWatchlist(slug),
    { enabled: !!slug, staleTime },
  );
}

/**
 * Hook that returns all the stuff to load into the map
 */
export function useHousingProjectMap(filterParams?: Record<string, any>) {
  const { housecatHost } = useProvider();
  const api = new HousecatAPI(housecatHost || DEFAULT_HOST);

  return useQuery<APIMapBoxResponse>(['housing map', filterParams], () =>
    api.requestPublicHousingProjectMap(filterParams),
  );
}

export function useAccount(email?: string): UseQueryResult<UserProfile> {
  const { housecatHost } = useProvider();
  const api = new HousecatAPI(housecatHost || DEFAULT_HOST);

  return useQuery<UserProfile>(['user', email], () =>
      api.requestAccount(email),
    { enabled: !!email, staleTime },
  );
}

export function useAccountList(filterParams?: Record<string, any>): UseQueryResult<UserProfile[]> {
  const { housecatHost } = useProvider();
  const api = new HousecatAPI(housecatHost || DEFAULT_HOST);

  return useQuery<UserProfile[]>(['users', filterParams], () =>
      api.requestAccounts(filterParams),
    { staleTime },
  );
}

export function useLoggedIn(onError: () => void) {
  const { housecatHost } = useProvider();
  const api = new HousecatAPI(housecatHost || DEFAULT_HOST);

  return useQuery<UserProfile>('logged-in', () => api.requestLoggedIn(), {
    onError
  });
}