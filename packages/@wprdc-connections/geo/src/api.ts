import { createAPI } from '@wprdc-connections/api';
import { ResponsePackage, Method } from '@wprdc-types/api';

import { Geog, GeogBrief, GeographyType, GeogLevel } from '@wprdc-types/geo';

// const HOST = 'https://api.profiles.wprdc.org';
const HOST = 'http://localhost:8000';

export enum Endpoint {
  Geog = 'geo',
  GeogTypes = 'geo/geog-types',
}

const api = createAPI<Endpoint>(HOST);

export function requestGeoLayers() {
  return api.callAndProcessEndpoint<GeogLevel[]>(
    Endpoint.GeogTypes,
    Method.GET
  );
}

export function requestGeogDetails(
  geogSlug: string
): Promise<ResponsePackage<Geog>> {
  return api.callAndProcessEndpoint<Geog>(Endpoint.Geog, Method.GET, {
    id: geogSlug,
    params: { details: true },
  });
}

export function requestGeogList(geogType: GeographyType) {
  return api.callAndProcessEndpoint<GeogBrief[]>(Endpoint.Geog, Method.GET, {
    id: geogType,
  });
}

export const GeoAPI = {
  requestGeogDetails,
  requestGeogList,
  requestGeoLayers,
};
