/**
 *
 * MiniMap
 *
 */
import * as React from 'react';
import './main.css';

import { Map } from '@wprdc-components/map';

import { PopupContentProps, LayerPanelVariant } from '@wprdc-types/map';

import styles from './DataMap.module.css';
import { ChartRecord, DataMapProps } from '@wprdc-types/viz';
import { LayerProps } from '@wprdc-types/map';
import { ConnectedMapEventHandler } from '@wprdc-types/connections';

export function DataMap(props: DataMapProps) {
  const { indicator, hoveredRecord, onHover } = props;
  const { error, mapOptions } = indicator;

  const handleHover: ConnectedMapEventHandler = e => {
    if (!!e && !!e.features && !!e.features.length) {
      const data = e.features[0].properties;
      if (!!onHover && !!data) {
        onHover(data as ChartRecord);
      }
    }
  };

  if (!!error && !!error.level) {
    console.error(error);
  }

  if (!mapOptions) return <div />;
  const { legends, defaultViewport } = mapOptions;

  function PopupContent({ primaryFeatureProps }: PopupContentProps) {
    if (primaryFeatureProps) {
      const {
        geogLabel,
        value,
        numberFormatOptions: numberFormatOptionsString,
      } = primaryFeatureProps;

      const numberFormatOptions = JSON.parse(numberFormatOptionsString);

      let displayValue = value;
      if (typeof value === 'number') {
        displayValue = value.toLocaleString('en-US', numberFormatOptions);
      }

      return (
        <div className={styles.popup}>
          {geogLabel}: <strong>{displayValue}</strong>
        </div>
      );
    }
    return <></>;
  }

  // TODO: highlight map based on hover state
  const layers: LayerProps[] = React.useMemo(() => {
    if (!!hoveredRecord) {
      const mainLayer: LayerProps = mapOptions.layers[0];
      console.log({ mainLayer });
      return [
        ...mapOptions.layers,

        {
          id: 'global/shared-highlight',
          // @ts-ignore  //todo: WTF is going on here
          source: mainLayer.source || '',
          // @ts-ignore
          'source-layer': mainLayer['source-layer'] || '',
          type: 'line',
          filter: ['==', ['get', 'geog'], hoveredRecord.geog],
          paint: {
            'line-color': '#000',

            'line-width': [
              'interpolate',
              ['exponential', 1.51],
              ['zoom'],
              0,

              1,
              8,
              4,
              16,
              14,
            ],
          },
        },
      ];
    }
    return mapOptions.layers;
  }, [hoveredRecord]);

  return (
    <Map
      initialViewState={
        defaultViewport || { longitude: -79.9925, latitude: 40.440624 }
      }
      layerPanelVariant={LayerPanelVariant.None}
      CustomHoverContents={PopupContent}
      legendItems={legends}
      hideLegendTitle
      scrollZoom={false}
      onHover={handleHover}
      {...mapOptions}
      layers={layers}
    />
  );
}
