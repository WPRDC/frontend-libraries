import { createAPI } from '@wprdc-connections/api';
import { Method } from '@wprdc-types/api';

import { Geog, GeogBrief, GeogLevel, GeographyType } from '@wprdc-types/geo';

const HOST = 'https://api.profiles.wprdc.org';

export enum Endpoint {
  Geog = 'geo',
  GeogTypes = 'geo/geog-types',
}

const api = createAPI<Endpoint>(HOST);

export function requestGeoLayers(): Promise<GeogLevel[]> {
  return api.callAndProcessEndpoint<GeogLevel[]>(
    Endpoint.GeogTypes,
    Method.GET,
  );
}

export function requestGeogDetails(geogSlug?: string): Promise<Geog> {
  if (!geogSlug) throw Error('no slug provided');
  return api.callAndProcessEndpoint<Geog>(Endpoint.Geog, Method.GET, {
    id: geogSlug,
    params: { details: true },
  });
}

export function requestGeogList(geogType: GeographyType): Promise<GeogBrief[]> {
  return api.callAndProcessEndpoint<GeogBrief[]>(Endpoint.Geog, Method.GET, {
    id: geogType,
  });
}

export const GeoAPI = {
  requestGeogDetails,
  requestGeogList,
  requestGeoLayers,
};
