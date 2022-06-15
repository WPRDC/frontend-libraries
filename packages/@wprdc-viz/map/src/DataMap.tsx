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
import { DataMapProps } from '@wprdc-types/viz';

export function DataMap(props: DataMapProps) {
  const { indicator } = props;
  const { options, error } = indicator;

  if (!!error && !!error.level) {
    console.error(error);
  }

  if (!options.mapOptions) return <div />;
  const { sources, layers, mapOptions, legends } = options.mapOptions;

  function PopupContent({ primaryFeatureProps }: PopupContentProps) {
    if (primaryFeatureProps) {
      const {
        geo_name: name,
        value,
        number_format_options: numberFormatOptionsString,
      } = primaryFeatureProps;

      const numberFormatOptions = JSON.parse(numberFormatOptionsString);

      let displayValue = value;
      if (typeof value === 'number') {
        displayValue = value.toLocaleString('en-US', numberFormatOptions);
      }

      return (
        <div className={styles.popup}>
          {name}: <strong>{displayValue}</strong>
        </div>
      );
    }
    return <></>;
  }

  return (
    <Map
      initialViewState={{ zoom: 8, longitude: -79.9925, latitude: 40.440624 }}
      layerPanelVariant={LayerPanelVariant.None}
      CustomHoverContents={PopupContent}
      legendItems={legends}
      sources={sources}
      layers={layers}
      hideLegendTitle
      {...mapOptions}
    />
  );
}
