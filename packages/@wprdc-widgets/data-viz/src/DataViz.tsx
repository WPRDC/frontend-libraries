/**
 *
 * DataViz
 *
 */
import React from 'react';

import './main.css';

import {
  DataVizBase,
  Downloaded,
  DataVizProps,
  ErrorRecord,
} from '@wprdc-types/viz';

import { DataVizVariant } from '@wprdc-types/data-viz';

import { ColorScheme } from '@wprdc-types/shared';
import { GeogBrief } from '@wprdc-types/geo';

import { getSpecificDataViz, getVariantComponent } from './util';

interface Props {
  dataViz?: Downloaded<DataVizBase>;
  geog?: GeogBrief;
  variant: DataVizVariant;
  isLoading?: boolean;
  error?: ErrorRecord;
  colorScheme?: ColorScheme;
  onExplore?: (dataViz: DataVizBase) => void;
  showGeog?: boolean;
  onGeogSelection?: (g: GeogBrief) => void;
}

export function DataViz(props: Props) {
  const {
    dataViz,
    geog,
    showGeog,
    colorScheme,
    isLoading,
    error,
    variant = DataVizVariant.Default,
    onExplore,
  } = props;

  function handleExplore() {
    if (!!onExplore && !!dataViz) onExplore(dataViz);
  }

  // get correct component for the viz
  const Visualization: React.FC<DataVizProps> | undefined = getSpecificDataViz(
    dataViz,
    error
  );

  // variant controls the contents and style of component around the actual dataviz
  const WrapperComponent = getVariantComponent(variant);

  return (
    <>
      <WrapperComponent
        dataViz={dataViz}
        geog={geog}
        showGeog={showGeog}
        Visualization={Visualization}
        colorScheme={colorScheme || ColorScheme.Light}
        isLoading={!!isLoading}
        onExplore={handleExplore}
        error={error}
      />
    </>
  );
}

export default DataViz;
