import { useState, useEffect, Key } from 'react';

import theme from './theme';

import { GeographyType } from '@wprdc-types/geo';
import { MapPluginHookArgs, MapPluginToolbox } from '@wprdc-types/connections';

import {
  SourceProps,
  LayerProps,
  LegendItemProps,
  Expression,
  MapLayerMouseEvent,
} from '@wprdc-types/map';

import { ColorScheme, Resource, Selection } from '@wprdc-types/shared';
import { ViewState } from 'react-map-gl';

export const CARTO_USER = 'wprdc';
export const MAPS_API_ENDPOINT = `https://${CARTO_USER}.carto.com/api/v1/map`;

export function useMapPlugin<T extends Resource, E>({
  connection,
  layerItems,
  layerSelection,
  selectedMapItem,
  selectedFilter: defaultSelectedFilter,
  options,
  context,
}: MapPluginHookArgs<T, E>): MapPluginToolbox<T, E> {
  const colorScheme = ColorScheme.Light;
  // Mapbox spec/props
  const [sources, setSources] = useState<SourceProps[]>();
  const [layers, setLayers] = useState<LayerProps[]>();
  // Content
  const [legendItems, setLegendItems] = useState<LegendItemProps[]>();
  const [legendSection, setLegendSection] = useState<JSX.Element>();
  const [layerPanelSection, setLayerPanelSection] = useState<JSX.Element>();
  const [mapSection, setMapSection] = useState<JSX.Element>();
  const [selection, setSelection] = useState<Selection>(
    layerSelection || (new Set() as Set<Key>)
  );

  // for filtering styled layers for interaction states
  const [hoveredFilter, setHoveredFilter] = useState<Expression>(
    clearLayerFilter()
  );
  const [selectedFilter, setSelectedFilter] = useState<Expression>(
    defaultSelectedFilter || clearLayerFilter()
  );
  const [interactiveLayerIDs, setInteractiveLayerIDs] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [viewState, setViewState] = useState<Partial<ViewState>>();

  // handle keeping track of freshness of selected item
  const hashElement = connection.hashElement || ((e?: E) => e);

  // When a selection is provided, it needs to override the inside state
  useEffect(() => {
    if (!!layerSelection) setSelection(layerSelection);
  }, [layerSelection]);

  // Update map contents when source or layer data change
  useEffect(() => {
    connection.makeMapSection(setMapSection, sources, layers);
  }, [sources, layers]);

  // Update filters and handle viewport changes on selection change

  useEffect(() => {
    if (!!selectedMapItem) {
      // handle panning/zooming to item if the connection supports it
      if (!!connection.makeViewState)
        setViewState(connection.makeViewState(selectedMapItem));
      setSelectedFilter(connection.makeFilter(selectedMapItem));
    } else setSelectedFilter(clearLayerFilter());
  }, [hashElement(selectedMapItem)]);

  // Update filters on hover change
  useEffect(() => {
    // When the user hovers over the map or selects something, we only need to
    // update the layers as those interactions don't affect the deeper map state
    if (!!layerItems) {
      connection.getLayers(layerItems, selection, setLayers, {
        ...options,
        ...context,
        colorScheme,
        hoveredFilter,
        selectedFilter,
      });
    }
  }, [hoveredFilter, selectedFilter]);

  // Update map data on selection or option change
  useEffect(() => {
    if (!!layerItems) {
      // signal that the first layer is the only layer to render, and is always rendered
      if (!!options && !!options.permanentLayer) {
        setSelection(new Set(layerItems[0].name));
      }
      // get mapbox source tiles
      connection.getSources(layerItems, selection, setSources, {
        ...options,
        ...context,
        colorScheme,
      });
      // get mapbox layers
      connection.getLayers(layerItems, selection, setLayers, {
        ...options,
        ...context,
        colorScheme,
        hoveredFilter,
        selectedFilter,
      });
      // get legend props
      connection.getLegendItems(layerItems, selection, setLegendItems, {
        ...options,
        ...context,
        colorScheme,
      });
      setInteractiveLayerIDs(
        connection.getInteractiveLayerIDs(layerItems, selection)
      );

      setSelectedItems(connection.getSelectedItems(layerItems, selection));
    }
  }, [layerItems, selection, options]);

  // Update the section element when the legend items change
  useEffect(() => {
    connection.makeLegendSection(setLegendSection, legendItems);
  }, [legendItems]);

  // Update layer panel section when the available layers change
  useEffect(() => {
    connection.makeLayerPanelSection(
      setLayerPanelSection,
      layerItems,
      selectedItems,
      handleLayerSelection
    );
  }, [layerItems, selectedItems]);

  /**
   * Runs when a layer is selected in the map's menu.
   */
  const handleLayerSelection = (selection: Selection) => {
    setSelection(selection);
  };

  /**
   * The map's mouse event handler will call this function as part of what
   * it does on hover events.
   *
   * @param event
   */
  const handleHover = (event: MapLayerMouseEvent) => {
    const hoveredItems: E[] = connection.parseMapEvent(event, {
      selectedLayers: selection,
    });
    setHoveredFilter(connection.makeFilter(hoveredItems));
    return hoveredItems;
  };

  /**
   * The map's mouse event handler will call this function as part of what
   * it does on click events.
   * @param event
   */
  const handleClick = (event: MapLayerMouseEvent) => {
    const clickedItems = connection.parseMapEvent(event);
    setSelectedFilter(connection.makeFilter(clickedItems));
    return clickedItems;
  };

  const { makeHoverContent, makeClickContent } = connection;

  return {
    name: connection.name,
    layerItems,
    sources,
    layers,
    legendItems,
    legendSection,
    layerPanelSection,
    interactiveLayerIDs,
    mapSection,
    selectedItems,
    viewState,
    handleLayerSelection,
    handleHover,
    handleClick,
    makeHoverContent,
    makeClickContent,
  };
}

export function clearLayerFilter(): Expression {
  return ['==', 'geogid', 'w00t'];
}

type cartoResponse = {
  metadata: { tilejson: { vector: { tiles: string[] } } };
};

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

export function makeLayers(
  geogType: GeographyType,
  hoveredFilter?: Expression,
  selectedFilter?: Expression,
  baseFilter?: Expression,
  highlightFilter?: Expression
): LayerProps[] {
  const source = `menu/${geogType}`;
  const sourceLayer = `maps.v_${geogType.toLowerCase()}`;

  return [
    {
      id: `${geogType}/hover`,
      type: 'fill',
      source,
      'source-layer': sourceLayer,
      layout: {},
      paint: {
        'fill-opacity': theme.polygons.fillOpacity.standard,
        'fill-color': theme.polygons.hoverColor,
      },
      filter: hoveredFilter || clearLayerFilter(),
    },
    {
      id: `${geogType}/selected`,
      type: 'fill',
      source,
      'source-layer': sourceLayer,
      layout: {},
      paint: {
        'fill-opacity': theme.polygons.fillOpacity.standard,
        'fill-color': theme.polygons.selectedColor,
      },
      filter: selectedFilter || clearLayerFilter(),
    },
    {
      id: `${geogType}/highlighted/line`,
      type: 'line',
      source,
      'source-layer': sourceLayer,
      layout: {},
      paint: {
        'line-width': theme.polygons.lineWidth.standard,
        'line-opacity': theme.polygons.lineOpacity.opaque,
        'line-color': theme.polygons.highlightLineColor,
      },
      filter: highlightFilter || clearLayerFilter(),
    },
    {
      id: `${geogType}/highlighted/fill`,
      type: 'fill',
      source,
      'source-layer': sourceLayer,
      layout: {},
      paint: {
        'fill-opacity': theme.polygons.fillOpacity.light,
        'fill-color': theme.polygons.highlightFillColor,
      },
      filter: highlightFilter || clearLayerFilter(),
    },

    {
      id: `${geogType}/borders`,
      type: 'line',
      source,
      'source-layer': sourceLayer,
      layout: {
        'line-join': 'round',
      },
      paint: {
        'line-width': theme.polygons.lineWidth.dense,
        'line-opacity': theme.polygons.lineOpacity.standard,
        'line-color': theme.polygons.lineColor,
      },
      filter: baseFilter || ['!=', 'global_geoid', ''],
    },
    {
      id: `${geogType}/fill`,
      type: 'fill',
      source,
      'source-layer': sourceLayer,
      layout: {},
      paint: {
        'fill-opacity': theme.polygons.fillOpacity.selection,
        'fill-color': theme.polygons.fillColor,
      },
      filter: baseFilter || ['!=', 'global_geoid', ''],
    },
  ];
}
