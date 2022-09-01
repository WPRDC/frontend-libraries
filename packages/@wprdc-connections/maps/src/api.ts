/**
 *
 * Profiles API
 *
 * Settings and functions that handle communicating with profiles backend.
 *
 */
import { createAPI } from '@wprdc-connections/api';
import { Method } from '@wprdc-types/api';
import { MapLayer } from '@wprdc-types/maps';


const HOST = 'https://api.profiles.wprdc.org';

enum Endpoint {
  MapLayers = 'maps/map-layers',
}

const api = createAPI<Endpoint>(HOST);

function requestMapLayers(
  params?: Record<string, string>,
): Promise<MapLayer[]> {
  return api.callAndProcessListEndpoint<MapLayer>(Endpoint.MapLayers, Method.GET, { params });
}

function requestMapLayer(
  slug?: string,
  params?: Record<string, string>,
): Promise<MapLayer> {
  if (!slug) throw Error('Missing slug');
  return api.callAndProcessEndpoint<MapLayer>(Endpoint.MapLayers, Method.GET, { id: slug, params });
}

export const MapsAPI = {
  requestMapLayers,
  requestMapLayer,
};
