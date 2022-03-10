import { LayerProps, SourceProps } from 'react-map-gl';

import { LegendItemProps, MapProps } from '@wprdc-types/map';
import { DataVizType } from '@wprdc-types/shared';

import { DataVizBase } from './common';

export type MiniMapOptions = {
  sources: SourceProps[];
  layers: LayerProps[];
  mapOptions: Partial<MapProps>;
  legends: LegendItemProps[];
  localeOptions?: Partial<Intl.NumberFormatOptions>;
};

export type MiniMapData = null;

export interface MiniMapViz extends DataVizBase {
  options?: MiniMapOptions;
  vizType: DataVizType.MiniMap;
}
