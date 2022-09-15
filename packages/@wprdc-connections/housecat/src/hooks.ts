import { ProjectIndex, ProjectIndexDetails, Watchlist } from '@wprdc-types/housecat';

import { HousecatAPI } from './api';

import { useQuery, UseQueryResult } from 'react-query';
import { APIMapBoxResponse } from '@wprdc-types/connections';
import { useProvider } from '@wprdc-components/provider';
import { DEFAULT_HOST } from './settings';


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
  );
}

export function useWatchlist(slug?: string) {
  const { housecatHost } = useProvider();
  const api = new HousecatAPI(housecatHost || DEFAULT_HOST);

  return useQuery<Watchlist>(['projectWatchlist', slug], () =>
    api.requestWatchlist(slug),
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
