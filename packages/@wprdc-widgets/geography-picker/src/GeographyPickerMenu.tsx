/**
 *
 * GeographyPicker
 *
 * Used to select a geographic area
 *
 */
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

import './main.css';
import styles from './GeographyPickerMenu.module.css';

import { Select } from '@wprdc-components/select';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { Map } from '@wprdc-components/map';

import {
  menuLayerConnection,
  GeographyConnection,
  GeoAPI,
} from '@wprdc-connections/geo';

import { GeogBrief, GeogLevel } from '@wprdc-types/geo';
import { LayerPanelVariant } from '@wprdc-types/map';

import {
  ConnectedMapEventHandler,
  ConnectionCollection,
} from '@wprdc-types/connections';

import { ProjectKey } from '@wprdc-types/shared';

import { Item } from '@wprdc-components/util';

import { GeographyPickerMenuProps } from '@wprdc-types/geography-picker';

export const GeographyPickerMenu: React.FC<GeographyPickerMenuProps> = ({
  selectedGeog,
  onSelection,
}) => {
  const [geogLevels, setGeogLevels] = useState<GeogLevel[]>();
  const [selectedGeogLevel, setSelectedGeogLevel] = useState<GeogLevel>();

  // on mount, get list of available layers
  useEffect(() => {
    GeoAPI.requestGeoLayers().then(({ data }) => setGeogLevels(data));
  }, []);

  // when the geogLevels load, select a default geogLevel
  useEffect(() => {
    if (!!geogLevels) {
      setSelectedGeogLevel(
        geogLevels.find(layer => layer.id === selectedGeog?.geogType) ||
          geogLevels[0]
      );
    }
  }, [geogLevels]);

  function handleGeogSelection(geog: GeogBrief) {
    if (!!onSelection) onSelection(geog);
  }

  const handleClick: ConnectedMapEventHandler = (_, __, toolboxItems) => {
    if (!!toolboxItems) {
      const clickedGeogs: GeogBrief[] | undefined =
        toolboxItems[ProjectKey.GeoMenu];
      if (!!clickedGeogs && !!clickedGeogs.length)
        handleGeogSelection(clickedGeogs[0]);
    }
  };

  function handleSelection(item: GeogLevel) {
    setSelectedGeogLevel(item);
  }

  const geogTypeSelection: Set<string> = useMemo(() => {
    if (!!selectedGeogLevel) return new Set([selectedGeogLevel.id]);
    return new Set();
  }, [selectedGeogLevel]);

  if (!geogLevels || !geogLevels.length || !selectedGeogLevel) return null;

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={styles.menuItem}>
          <div className={styles.dropdown}>
            <Select<GeogLevel>
              label="Type of area"
              items={geogLevels}
              selectedKey={selectedGeogLevel.id}
              onSelection={handleSelection}
            >
              {item => <Item key={item.id}>{item.name}</Item>}
            </Select>
          </div>
        </div>
        <div className={styles.menuItem}>
          <div className={styles.dropdown}>
            <ConnectedSearchBox
              label={`Search for a ${selectedGeogLevel.name}`}
              connection={new GeographyConnection(selectedGeogLevel.id)}
              onSelection={handleGeogSelection}
            />
          </div>
        </div>
      </div>
      <div className={styles.map}>
        <Map
          initialViewState={{
            zoom: 7,
            longitude: -79.995888,
            latitude: 40.440624,
          }}
          layerPanelVariant={LayerPanelVariant.None}
          connections={[menuLayerConnection] as ConnectionCollection}
          onClick={handleClick}
          connectionHookArgs={{
            [ProjectKey.GeoMenu]: {
              layerItems: geogLevels,
              layerSelection: geogTypeSelection,
            },
          }}
        />
      </div>
    </div>
  );
};

export default GeographyPickerMenu;
