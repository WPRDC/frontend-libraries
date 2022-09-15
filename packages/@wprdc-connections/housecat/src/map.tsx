import React from 'react';
import { ConnectionProps, MapPluginConnection } from '@wprdc-types/connections';

import { Layer, LegendItem, LegendSection, Source } from '@wprdc-components/map';
import { useMapPlugin } from '@wprdc-connections/util';

import { ProjectKey, Resource } from '@wprdc-types/shared';
import { ProjectIndexMapProperties } from '@wprdc-types/housecat';

import styles from './PopupContent.module.css';
import { CategoricalLegendItemProps } from '@wprdc-types/map';

interface AffordableHousingLayer extends Resource {
}

/** Static layer use when showing affordable housing map */
export const housingProjectLayer: AffordableHousingLayer = {
  id: ProjectKey.Housecat,
  name: 'Affordable Housing',
  slug: ProjectKey.Housecat,
};

export const affordableHousingProjectMapConnection: MapPluginConnection<AffordableHousingLayer,
  ProjectIndexMapProperties> = {
  name: ProjectKey.Housecat,
  use: useMapPlugin,
  getSources() {
    // retrieved from api in a hook
    return undefined;
  },
  getLayers() {
    // retrieved from api in a hook
    return undefined;
  },
  getLegendItems() {
  },
  getInteractiveLayerIDs() {
    return ['all-public-housing-projects/marker'];
  },
  parseMapEvent: event => {
    if (!!event && !!event.features) {
      const features = event.features.filter(
        feature =>
          !!feature &&
          !!feature.source &&
          !!feature.properties &&
          feature.source === 'all-public-housing-projects',
      );
      return features.map(
        ({ properties }) => properties as ProjectIndexMapProperties,
      );
    }
    return [];
  },
  makeFilter: () => {
    return ['==', 1, 1];
  },
  makeLegendSection: (setLegendSection, items) => {
    if (!!items && !!items.length)
      setLegendSection(
        <LegendSection title='Affordable Housing Projects by Funding Type'>
          {items.map(item => {
            const color: string =
              ((item as CategoricalLegendItemProps).marker as string) || 'gray';
            return (
              <LegendItem
                variant='categorical'
                marker={color}
                label={item.label}
              />
            );
          })}
          <p
            style={{ fontStyle: 'italic', fontWeight: 500, marginTop: '12px' }}
          >
            Marker size based on unit count
          </p>
          <p style={{ fontStyle: 'italic', fontWeight: 500 }}>
            Closed projects have a <span style={{ color: 'red' }}>red</span>{' '}
            stroke.
          </p>
        </LegendSection>,
      );
    else setLegendSection();
  },
  makeMapSection: (setMapSection, sources, layers) => {
    if (!!sources && !!layers) {
      setMapSection(
        <>
          <Source {...sources[0]} key={sources[0].id} />
          <Layer {...layers[0]} key={layers[0].id} />
        </>,
      );
    }
  },
  getSelectedItems(items, selection) {
    return selection === 'all'
      ? items
      : items.filter(item => selection.has(item.id));
  },
  makeLayerPanelSection() {
    // todo: implement
  },
  makeHoverContent: hoveredItems => {
    if (!!hoveredItems && !!hoveredItems.length)
      return (
        <div className={styles.title}>
          {hoveredItems[0]['hud_property_name']}
        </div>
      );
    return null;
  },
  makeClickContent: _ => {
    return null;
  },
};

export const defaultAffordableHousingProjectMapConnectionProps: ConnectionProps = {
  layerItems: [{ id: 'default', name: 'default', slug: 'default' }],
};
