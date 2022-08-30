import { useQuery } from 'react-query';
import { MapsAPI } from './api';
import { MapLayer } from '@wprdc-types/maps';


export function useMapLayers(){
  return useQuery<MapLayer[]>(
    ['mapLayers'],
    () => MapsAPI.requestMapLayers(),
  )
}

export function useMapLayer(slug?: string){
  return useQuery<MapLayer>(
    ['mapLayers'],
    () => MapsAPI.requestMapLayer(slug),
  )
}

