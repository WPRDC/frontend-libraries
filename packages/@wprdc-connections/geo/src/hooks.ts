import * as GeoAPI from './api';
import { useQuery, UseQueryResult } from 'react-query';
import { Geog, GeogLevel } from '@wprdc-types/geo';

export function useGeography(geogSlug?: string): UseQueryResult<Geog> {
  return useQuery(
    ['geog', geogSlug],
    () => GeoAPI.requestGeogDetails(geogSlug),
    { enabled: !!geogSlug },
  );
}

export function useGeographyLevels(): UseQueryResult<GeogLevel[]> {
  return useQuery<GeogLevel[]>('geogLevels', GeoAPI.requestGeoLayers);
}
