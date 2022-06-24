import { createAPI } from '@wprdc-connections/api';

import { Method } from '@wprdc-types/api';
import { APIMapBoxResponse } from '@wprdc-types/connections';
import { ProjectIndexDetails, Watchlist } from '@wprdc-types/housecat';
import { getCookie } from '@wprdc-connections/util';

const HOST = 'https://api.profiles.wprdc.org';

export enum Endpoint {
  PHProject = 'public-housing/project',
  PHProjectMap = 'public-housing/vector-map',
  Watchlist = 'public-housing/watchlist',
}

const api = createAPI<Endpoint>(HOST);

const headers = {
  'Content-Type': 'application/json',
  'X-CSRFToken': getCookie('csrftoken'),
};

// if projectID is provided a single detailed response will be expected
export function requestAffordableHousingProject(
  projectID: number,
  params?: Record<string, string>
): Promise<ProjectIndexDetails>;
// if projectID is not provided a list of projectIndexes will be expected
export function requestAffordableHousingProject(
  projectID: null | undefined,
  params?: Record<string, string>
): Promise<ProjectIndexDetails[]>;

/**
 * Request project data details or a list of projects
 *
 * If projectID is provided, details for that project will be returned.
 * if not, a list will be returned
 */
export function requestAffordableHousingProject(
  projectID: number | null | undefined,
  params?: Record<string, string>
) {
  return api.callAndProcessEndpoint<
    ProjectIndexDetails | ProjectIndexDetails[]
  >(Endpoint.PHProject, Method.GET, {
    id: projectID,
    headers,
    params,
    credentials: 'include',
  });
}

/**
 * Request project data in geojson format
 */
export function requestPublicHousingProjectMap(params?: Record<string, any>) {
  return api.callAndProcessEndpoint<APIMapBoxResponse>(
    Endpoint.PHProjectMap,
    Method.GET,
    { params, headers, credentials: 'include' }
  );
}

export function requestWatchlist(slug?: string) {
  if (!slug) throw Error('slug not provided');
  return api.callAndProcessEndpoint<Watchlist>(Endpoint.Watchlist, Method.GET, {
    id: slug,
    headers,
    credentials: 'include',
  });
}

export const HousecatAPI = {
  requestAffordableHousingProject,
  requestPublicHousingProjectMap,
  requestWatchlist,
};
