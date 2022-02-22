import { createAPI } from '@wprdc-connections/api';

import { ResponsePackage, Method } from '@wprdc-types/api';
import { APIMapBoxResponse } from '@wprdc-types/connections';
import { ProjectIndexDetails } from '@wprdc-types/housecat';

const HOST = 'https://api.profiles.wprdc.org';

export enum Endpoint {
  PHProject = 'public-housing/project',
  PHProjectMap = 'public-housing/vector-map',
}

const api = createAPI<Endpoint>(HOST);

// if projectID is provided a single detailed response will be expected
export function requestAffordableHousingProject(
  projectID: number,
  params?: Record<string, string>
): Promise<ResponsePackage<ProjectIndexDetails>>;
// if projectID is not provided a list of projectIndexes will be expected
export function requestAffordableHousingProject(
  projectID: null | undefined,
  params?: Record<string, string>
): Promise<ResponsePackage<ProjectIndexDetails[]>>;
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
    params: params,
  });
}

/**
 * Request project data in geojson format
 */
export function requestPublicHousingProjectMap(params?: Record<string, any>) {
  return api.callAndProcessEndpoint<APIMapBoxResponse>(
    Endpoint.PHProjectMap,
    Method.GET,
    { params }
  );
}

export const HousecatAPI = {
  requestAffordableHousingProject,
  requestPublicHousingProjectMap,
};
