import { useQuery, UseQueryResult } from 'react-query';
import { MapsAPI } from './api';
import { MapLayer } from '@wprdc-types/maps';

const staleTime = 1000 * 60 * 5;

export function useMapLayers(): UseQueryResult<MapLayer[]> {
  return useQuery<MapLayer[]>(
    ['mapLayers'],
    () => MapsAPI.requestMapLayers(),
  );
}

export function useMapLayer(slug?: string): UseQueryResult<MapLayer> {
  console.log(slug);
  return useQuery<MapLayer>(
    ['mapLayers'],
    () => MapsAPI.requestMapLayer(slug),
    { enabled: !!slug, staleTime },
  );
}

