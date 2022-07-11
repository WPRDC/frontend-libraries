/**
 * Connecting neighborhood assets to the @wprdc/map
 */

import * as React from 'react';

import * as chroma from 'chroma-js';

import { Layer, Source, LayerProps } from 'react-map-gl';

import {
  Expression,
  ExpressionName,
  CategoricalLegendItemProps,
} from '@wprdc-types/map';

import {
  AssetMapProperties,
  AssetType,
} from '@wprdc-types/neighborhood-assets';
import { MapPluginConnection } from '@wprdc-types/connections';
import { ColorScheme, ProjectKey } from '@wprdc-types/shared';

import { fetchCartoVectorSource } from '@wprdc-connections/util';

import { LegendSection, LegendItem } from '@wprdc-components/map';
import { CheckboxGroup, Checkbox } from '@wprdc-components/checkbox-group';

import {
  ASSETS_LAYER_ID,
  ASSETS_SOURCE_ID,
  ASSETS_CARTO_SQL,
} from './settings';
import { useMapPlugin } from '@wprdc-connections/util';

export const assetMapConnection: MapPluginConnection<
  AssetType,
  AssetMapProperties
> = {
  name: ProjectKey.NeighborhoodAssets,
  use: useMapPlugin,
  getSources: (_, __, setSources) => {
    fetchCartoVectorSource(ASSETS_SOURCE_ID, ASSETS_CARTO_SQL).then(
      source => setSources([source]),
      err => console.error('CARTO', err)
    );
  },
  getLayers: (items, selected, setLayers, options) => {
    const { colorScheme } = options || {};
    const categories =
      selected === 'all' ? items.map(item => item.name) : Array.from(selected);
    setLayers([makeAssetLayer(categories, colorScheme)]);
  },
  getLegendItems: (items, selected, setLegendItems, options) => {
    const selectedTypes =
      selected === 'all' ? items.map(item => item.name) : Array.from(selected);
    const { colorScheme } = options || {};
    const legendItems = makeAssetLegendItems(items, selectedTypes, colorScheme);
    setLegendItems(legendItems);
  },
  getInteractiveLayerIDs: (items, selected) => {
    const categories =
      selected === 'all' ? items.map(item => item.name) : Array.from(selected);
    // for now asset layer just has one id
    if (!!categories.length) return [ASSETS_LAYER_ID];
    return [];
  },
  parseMapEvent: event => {
    if (!!event && !!event.features) {
      const features = event.features.filter(
        feature =>
          !!feature &&
          !!feature.source &&
          !!feature.properties &&
          feature.source === ASSETS_SOURCE_ID
      );
      return features.map(({ properties }) => properties as AssetMapProperties);
    }
    return [];
  },
  makeFilter: item => {
    if (Array.isArray(item)) return ['in', 'geoid', item.map(i => i.id)];
    return ['==', 'id', item.id];
  },
  makeLegendSection: (setLegendSection, items) => {
    if (!!items && !!items.length)
      setLegendSection(
        <LegendSection title="Neighborhood Assets">
          {items.map(item => (
            <LegendItem {...item} />
          ))}
        </LegendSection>
      );
    else setLegendSection();
  },
  makeMapSection: (setMapSection, sources, layers) => {
    if (!!sources && !!layers) {
      setMapSection(
        <>
          <Source {...sources[0]} key={sources[0].id} />
          {/* @ts-ignore todo: WTF is up with layer types */}
          <Layer {...layers[0]} key={layers[0].id} />
        </>
      );
    }
  },
  getSelectedItems(items, selection) {
    return selection === 'all'
      ? items
      : items.filter(item => selection.has(item.name));
  },
  makeLayerPanelSection(setLayerPanelSection, items, _, handleChange) {
    function _handleChange(val: string[]) {
      if (!!handleChange) handleChange(new Set(val));
    }

    if (!!items && !!items.length)
      setLayerPanelSection(
        <div className="pt-2">
          <CheckboxGroup
            label="Select neighborhood assets to display"
            aria-label="select neighborhood asset layers to display"
            onChange={_handleChange}
          >
            {items.map(item => (
              <Checkbox
                key={`assets/${item.name}`}
                value={`assets/${item.name}`}
              >
                {item.title}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      );
  },
  makeHoverContent: hoveredItems => {
    if (!!hoveredItems && !!hoveredItems.length)
      return <div className="text-xs">{hoveredItems[0].name}</div>;
    return null;
  },
  makeClickContent: () => {
    return null;
  },
};

export const makeAssetLegendItems = (
  availableAssetTypes: AssetType[],
  selectedAssetTypes: React.Key[],
  colorScheme: ColorScheme = ColorScheme.Light
) => {
  return availableAssetTypes
    .filter(at => selectedAssetTypes.includes(at.name))
    .map(at => ({
      variant: 'categorical',
      key: at.name,
      label: at.title,
      marker: categoryColors(
        selectedAssetTypes.map(t => t.toString()),
        colorScheme
      )[at.name],
    })) as CategoricalLegendItemProps[];
};

export const makeAssetLayer = (
  categories: React.Key[],
  colorScheme: ColorScheme = ColorScheme.Light,
  field: string = 'asset_type'
): LayerProps => ({
  id: ASSETS_LAYER_ID,
  source: ASSETS_SOURCE_ID,
  'source-layer': ASSETS_SOURCE_ID,
  type: 'circle',
  filter: ['in', field, ...categories],
  paint: {
    'circle-radius': [
      'interpolate',
      ['cubic-bezier', 0.5, 0, 0.5, 1],
      ['zoom'],
      8,
      3,
      22,
      12,
    ],
    'circle-color': colorExpression(
      categories.map(c => `${c}`),
      colorScheme,
      field
    ),
    'circle-stroke-width': 1,
    'circle-stroke-color': 'rgb(55,65,81)',
    'circle-stroke-opacity': {
      stops: [
        [0, 0],
        [9, 0.5],
        [12, 1],
      ],
    },
  },
});

/**
 * Generates Mapbox expression that colors map points based on category
 *
 * @param {string[]} categories
 * @param {'light' | 'dark'} colorScheme
 * @param field
 */
const colorExpression = (
  categories: string[],
  colorScheme: ColorScheme = ColorScheme.Light,
  field: string = 'asset_type'
): Expression | string => {
  const colors = Object.entries(categoryColors(categories, colorScheme)).reduce(
    (expression, [cat, color]) => [...expression, [cat], color] as string[],
    [] as string[]
  );

  if (!colors || !colors.length) {
    return 'black';
  }

  const result = [
    'match' as ExpressionName,
    ['get', field],
    ...colors,
    'hsl(0, 0%, 0%)',
  ] as Expression;

  return result;
};

const categoryColors = (
  categories: string[],
  colorScheme: ColorScheme = ColorScheme.Light
) =>
  categories.reduce(
    (record, category, index) => ({
      ...record,
      [category]:
        colorScheme === 'light'
          ? chroma.brewer.Set1[index]
          : chroma.brewer.Set1[index],
    }),
    {} as Record<string, string>
  );
2;
