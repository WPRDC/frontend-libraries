/**
 *
 * MapInterface
 *
 */
import * as React from 'react';

import styles from './MapInterface.module.css';
import {
  affordableHousingProjectConnection,
  affordableHousingProjectMapConnection,
  ConnectedSearchBox,
  ConnectedSelect,
  defaultAffordableHousingProjectMapConnectionProps,
  GeogBrief,
  GeographyConnection,
  GeographyType,
  Map,
  ProjectIndex,
  ProjectKey,
} from '@wprdc/toolkit';
import { FilterFormValues } from '../../types';
import { MapRef } from 'react-map-gl';
import { ConnectedMapEventHandler } from '@wprdc-types/connections';

interface Props {
  filterParams?: FilterFormValues;
  handleProjectSelection: (id: number) => void;
}

function makeConnectionHookArgs(filterParams?: FilterFormValues) {
  return {
    ...defaultAffordableHousingProjectMapConnectionProps,
    options: {
      ...defaultAffordableHousingProjectMapConnectionProps.options,
      filterParams,
    },
  };
}

export function MapInterface({ filterParams, handleProjectSelection }: Props) {
  const mapRef = React.useRef<MapRef>(null);

  const handleZoomSelect = (zoom: number) =>
    React.useCallback(({ centroid }: { centroid?: [number, number] }) => {
      if (!!centroid) {
        mapRef.current?.flyTo({ center: centroid, zoom, duration: 1300 });
      }
    }, []);

  const handleClick: ConnectedMapEventHandler = (_, __, toolboxItems) => {
    if (!!toolboxItems) {
      const items = toolboxItems[ProjectKey.Housecat];
      if (!!items && items.length) handleProjectSelection(items[0].id);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuSection}>
        <fieldset className={styles.zoomControls}>
          <div className={styles.zoomLabel}>
            <legend className={styles.menuLegend}>Zoom Map To</legend>
          </div>
          <div className={styles.zoomSection}>
            <ConnectedSelect<GeogBrief>
              label="Zip code"
              aria-label="zoom to zip code"
              id="zip-code-zoom"
              connection={new GeographyConnection(GeographyType.ZCTA, 100)}
              onSelection={handleZoomSelect(14)}
            />
          </div>
          <div className={styles.zoomSection}>
            <ConnectedSelect<GeogBrief>
              label="Pittsburgh Neighborhood"
              aria-label="zoom to neighborhood"
              connection={
                new GeographyConnection(GeographyType.Neighborhood, 100)
              }
              onSelection={handleZoomSelect(14)}
            />
          </div>

          <div className={styles.searchBox}>
            <ConnectedSearchBox<ProjectIndex>
              label="Project"
              connection={affordableHousingProjectConnection}
              onSelection={handleZoomSelect(16)}
            />
          </div>
        </fieldset>
      </div>
      <div className={styles.mapSection}>
        <Map
          ref={mapRef}
          connections={[affordableHousingProjectMapConnection]}
          connectionHookArgs={{
            [ProjectKey.Housecat]: makeConnectionHookArgs(filterParams),
          }}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
