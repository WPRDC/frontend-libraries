import { Feature } from 'geojson';
import {
  LayerProps,
  MapLayerMouseEvent,
  MapRef,
  SourceProps,
  ViewState,
} from 'react-map-gl';
import {
  ASSETS_SOURCE_ID,
  MAPS_API_ENDPOINT,
  PROFILES_SOURCE_ID,
} from './settings';
import { GeographyType } from '@wprdc-types/geo';
import { Expression } from 'mapbox-gl';
import { AssetMapProperties } from '@wprdc-types/neighborhood-assets';
import { PopupContentProps } from '@wprdc-types/map';
import {
  ConnectionResourcesRecord,
  MapPluginToolbox,
} from '@wprdc-types/connections';
import { RefObject } from 'react';
import React from 'react';

export function makeContentProps(event: MapLayerMouseEvent): PopupContentProps {
  const features: Feature[] = event.features || [];
  const primaryFeatureProps = !!features.length ? features[0].properties : {};

  return { event, features, primaryFeatureProps };
}

export function extractFeatureFromEvent(
  event: MapLayerMouseEvent
): Feature | undefined {
  if (event && event.features && event.features.length) {
    return event.features[0];
  }
  return undefined;
}

export function hasFeatures(event: MapLayerMouseEvent): boolean {
  return !!extractFeatureFromEvent(event);
}

export function cartoInstantiationParams(id: string, sql: string) {
  return {
    layers: [
      {
        id,
        options: {
          sql,
        },
      },
    ],
  };
}

type cartoResponse = {
  metadata: { tilejson: { vector: { tiles: string[] } } };
};

export function extractCartoTileUrls(data: cartoResponse): string[] {
  return data.metadata.tilejson.vector.tiles;
}

export function fetchCartoVectorSource(
  id: string,
  sql: string,
  apiKey?: string,
  type: 'vector' = 'vector',
  minzoom = 0,
  maxzoom = 22
): PromiseLike<SourceProps> {
  const config = encodeURIComponent(
    JSON.stringify(cartoInstantiationParams(id, sql))
  );

  const keyParam = apiKey ? `&api_key=${apiKey}` : '';

  return new Promise((resolve, reject) => {
    fetch(`${MAPS_API_ENDPOINT}?config=${config}${keyParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(
        (response) => response.json(),
        (error) => reject(error)
      )
      .then(
        (data) => {
          resolve({
            id,
            type,
            tiles: extractCartoTileUrls(data),
            minzoom,
            maxzoom,
          });
        },
        (error) => reject(error)
      );
  });
}

export function getHoverPopupItems(
  features: any[],
  menuGeogType?: GeographyType
): {
  assetsItems: AssetMapProperties[];
  profilesItems: Record<string, any>[];
  menuGeog: Record<'geogid' | 'name' | string, any>;
} {
  const sorted = sortFeatures(features, menuGeogType);
  return {
    assetsItems: sorted[ASSETS_SOURCE_ID],
    profilesItems: sorted[PROFILES_SOURCE_ID],
    menuGeog: sorted.menuGeog,
  };
}

/**
 * Sort features into project-specific lists.
 * @param features
 * @param menuGeogType
 */
function sortFeatures(
  features: any[],
  menuGeogType?: GeographyType
): {
  w__assets: AssetMapProperties[];
  w__profiles: Record<string, any>[];
  menuGeog: Record<string, any>;
} {
  const sortedFeatures = {
    [ASSETS_SOURCE_ID]: [] as AssetMapProperties[],
    [PROFILES_SOURCE_ID]: [] as Record<string, any>[],
    menuGeog: {} as Record<string, any>,
  };

  for (const feature of features) {
    if (!feature || !feature.source || !feature.properties) continue;
    if (feature.source in sortedFeatures) {
      sortedFeatures[feature.source as keyof typeof sortedFeatures].push(
        feature.properties as Record<string, any>
      );
    }
    if (menuGeogType && feature.source === menuGeogType) {
      sortedFeatures.menuGeog = feature.properties as Record<string, any>;
    }
  }
  return sortedFeatures;
}

/**
 * Builds viewState by combining provided toolbox viewStates right-to-left.
 * This prioritizes earlier toolboxes in the array.
 * @param toolboxes
 */
export function flattenToolboxViewStates(
  toolboxes: MapPluginToolbox<any, any>[]
): Partial<ViewState> {
  return toolboxes.reduceRight((acc, toolbox) => {
    if (!!toolbox.viewState) {
      return { ...acc, ...toolbox.viewState };
    }
    return acc;
  }, {} as Partial<ViewState>);
}

/**
 * Serializes view state object so that it can be easily checked for differences.
 */
export function hashViewState(vs: Partial<ViewState>) {
  return Object.values(vs).join('/');
}

export const layerType = (l: LayerProps) => l.id && l.id.split('/')[1];

export const layerFilter = (l: LayerProps) => layerType(l) === 'fill';

export function filterLayerByGeogID(geogID: string): Expression {
  return ['==', 'geogid', geogID];
}

export function clearLayerFilter(): Expression {
  return ['==', 'geogid', 'w00t'];
}

/**
 *
 * @param layers
 * @param hoveredFilter
 * @param selectedFilter
 */
export function filteredLayers(
  layers: LayerProps[],
  hoveredFilter: Expression,
  selectedFilter: Expression
): LayerProps[] {
  return layers.map((layer) => {
    switch (getLayerType(layer)) {
      case 'hover':
        return { ...layer, filter: hoveredFilter };
      case 'selected':
        return { ...layer, filter: selectedFilter };
      default:
        return layer;
    }
  });
}

export function getLayerType(layer: LayerProps) {
  if (!!layer.id) return layer.id.split('/')[1];
  return '';
}

/**
 *  Runs the proper map event handler on each toolbox and returns the items
 *  generated from the event and the popup content to render for those items.
 */
export function handleMouseEventForToolboxes(
  toolboxes: MapPluginToolbox<any, any>[],
  event: MapLayerMouseEvent,
  eventType: 'click' | 'hover'
): {
  toolboxContents: JSX.Element[];
  toolboxItems: ConnectionResourcesRecord;
} {
  return toolboxes.reduce(
    (result, tb) => {
      let items: any[] = [];
      let content: JSX.Element[] = [];
      if (eventType === 'click') {
        items = tb.handleClick(event);
        const tmpContent = tb.makeClickContent(items || [], event);
        if (!!tmpContent) content.push(tmpContent);
      }
      if (eventType === 'hover') {
        items = tb.handleHover(event);
        const tmpContent = tb.makeHoverContent(items || [], event);
        if (!!tmpContent) content.push(tmpContent);
      }
      return {
        toolboxItems: { ...result.toolboxItems, [tb.name]: items },
        toolboxContents: [...result.toolboxContents, ...content],
      };
    },
    {
      toolboxItems: {} as ConnectionResourcesRecord,
      toolboxContents: [] as JSX.Element[],
    }
  );
}

export const DEFAULT_GEOIDS: Record<GeographyType, string> = {
  [GeographyType.County]: '42003',
  [GeographyType.State]: '42',
  [GeographyType.CountySubdivision]: '4200361000',
  [GeographyType.Tract]: '42003040200',
  [GeographyType.BlockGroup]: '420030402002',
  [GeographyType.ZCTA]: '15213',
  [GeographyType.SchoolDistrict]: '4219170',
  [GeographyType.Neighborhood]: '4219170',
};

/**
 * Hook that combines inner and outer (and any other) map refs to allow
 * controlling the map to be done by default in the library component
 */
export function useCombinedRefs(...refs: any[]): RefObject<MapRef> {
  const targetRef = React.useRef<MapRef>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
