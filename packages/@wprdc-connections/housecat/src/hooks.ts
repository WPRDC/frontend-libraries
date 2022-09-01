import { ProjectIndex, ProjectIndexDetails, Watchlist } from '@wprdc-types/housecat';

import { HousecatAPI } from './api';

import { useQuery, UseQueryResult } from 'react-query';
import { APIMapBoxResponse } from '@wprdc-types/connections';

export function usePublicHousingProject(
  identifier?: number | string | ProjectIndex,
): UseQueryResult<ProjectIndexDetails> {
  let argID: number;
  if (typeof identifier === 'object') argID = identifier.id;
  else argID = parseInt(identifier as string);
  return useQuery<ProjectIndexDetails>(['projectDetails', argID], () =>
    HousecatAPI.requestAffordableHousingProject(argID),
  );
}

export function useWatchlist(slug?: string) {
  return useQuery<Watchlist>(['projectWatchlist', slug], () =>
    HousecatAPI.requestWatchlist(slug),
  );
}

/**
 * Hook that returns all the stuff to load into the map
 */
export function useHousingProjectMap(filterParams?: Record<string, any>) {
  return useQuery<APIMapBoxResponse>(['housing map', filterParams], () =>
    HousecatAPI.requestPublicHousingProjectMap(filterParams),
  );
}
