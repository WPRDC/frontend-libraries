import React from 'react';
import { MapPluginConnection } from '@wprdc-types/connections';
import { GeogBrief, GeogLevel } from '@wprdc-types/geo';
import { Layer, Source } from '@wprdc-components/map';
import { Radio, RadioGroup } from '@wprdc-components/radio-group';
import {
  clearLayerFilter,
  makeLayers,
  useMapPlugin,
} from '@wprdc-connections/util';
import { ProjectKey } from '@wprdc-types/shared';

//maps.v_neighborhood

export const menuLayerConnection: MapPluginConnection<GeogLevel, GeogBrief> = {
  name: ProjectKey.GeoMenu,
  use: useMapPlugin,
  getSources: (items, selection, setSources) => {
    // menu doesn't allow select many
    if (typeof selection === 'string')
      throw Error('Multiple select should not be available in map menu.');
    const selectedLayer = items.find(item => selection.has(item.id));

    if (!!selectedLayer)
      setSources([
        {
          id: `menu/${selectedLayer.id}`,
          type: 'vector',
          url: `https://api.profiles.wprdc.org/tiles/maps.${selectedLayer.id.toLowerCase()}.json`,
        },
      ]);
  },
  getLayers: (items, selected, setLayers, options) => {
    if (typeof selected === 'string')
      throw Error('Multiple select should not be available in map menu.');
    const selectedLayer = items.find(item => selected.has(item.id));
    const { hoveredFilter, selectedFilter, highlightFilter } = options || {};

    // todo: build source based on selection.  or just put them all up at once tbh
    if (!!selectedLayer)
      setLayers(
        makeLayers(
          selectedLayer.id,
          hoveredFilter,
          selectedFilter,
          undefined,
          highlightFilter
        )
      );
  },
  getLegendItems: () => {
    // for now, we don't show a legend item for the menu, so this will be a noop.
  },
  getInteractiveLayerIDs: (items, selected) => {
    if (typeof selected === 'string')
      throw Error('Multiple select should not be available in map menu.');

    const selectedLayer = items.find(item => selected.has(item.id));

    if (!!selectedLayer) return [`${selectedLayer.id}/fill`];
    return [];
  },
  parseMapEvent: event => {
    if (!!event && !!event.features) {
      const features = event.features.filter(
        feature =>
          !!feature &&
          !!feature.source &&
          typeof feature.source === 'string' &&
          !!feature.properties &&
          feature.source.substring(0, 4) === 'menu'
      );
      let result: GeogBrief[] = [];
      for (const feature of features) {
        if (feature.properties)
          result.push({
            id: feature.properties.id,
            name: feature.properties.name,
            title: feature.properties.display_name,
            slug: feature.properties.slug,
            description: feature.properties.description,
            geogType: feature.properties.geog_type,
            geogID: feature.properties.global_geoid,
          } as GeogBrief);
      }
      return result;
    }
    return [];
  },
  makeFilter: item => {
    if (Array.isArray(item)) {
      if (!item.length) return clearLayerFilter();
      if (item.length === 1) return ['==', 'slug', item[0].slug];
      return ['in', 'slug', ['literal', item.map(i => i.slug)]];
    }
    return ['==', 'slug', item.slug];
  },
  // the menu layer doesn't need to be indicated in the legend section for now
  makeLegendSection: setLegendSection => setLegendSection(),
  makeMapSection(setMapSection, sources, layers) {
    if (!!sources && !!layers) {
      setMapSection(
        <>
          {sources.map(source => (
            <Source {...source} key={source.id} />
          ))}
          {layers.map(layer => (
            <Layer {...layer} key={layer.id} />
          ))}
        </>
      );
    } else setMapSection();
  },
  getSelectedItems(items, selection) {
    return selection === 'all'
      ? items
      : items.filter(item => selection.has(item.id));
  },
  makeHoverContent: hoveredItems => {
    if (!!hoveredItems && !!hoveredItems.length)
      return <div className="text-xs">{hoveredItems[0].name}</div>;
    return null;
  },
  makeClickContent: () => {
    return null;
  },
  makeLayerPanelSection(setLayerPanelSection, items, _, handleChange) {
    function _handleChange(val: string) {
      if (handleChange) handleChange(new Set([val]));
    }

    if (!!items) {
      if (items.length === 1) {
        setLayerPanelSection(undefined);
      } else {
        setLayerPanelSection(
          <div key={'geo-menu'}>
            <RadioGroup
              label="Select a menu layer"
              aria-label="select the geographic menu layer to display"
              onChange={_handleChange}
            >
              {items.map(item => (
                <Radio key={`menu/${item.id}`} value={`menu/${item.id}`}>
                  {item.name}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        );
      }
    }
  },
  makeViewState: (selectedItem: GeogBrief) => {
    const { centroid } = selectedItem;
    if (!!centroid) {
      return {
        latitude: centroid[0],
        longitude: centroid[1],
      };
    }
    return {};
  },
  hashElement: selectedItem => (selectedItem ? selectedItem.slug : null),
};
