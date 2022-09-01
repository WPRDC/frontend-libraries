import React from 'react';

import {
  LayerProps,
  MapLayerMouseEvent,
  MapLayerTouchEvent,
  MapProps as RMGMapProps,
  MapRef,
  PopupProps as RMGPopupProps,
  SourceProps,
} from 'react-map-gl';

import { ColorScheme } from '@wprdc-types/shared';

import { PopupContentComponent } from './popup';
import { LegendItemProps } from './legend';
import { LayerPanelVariant } from './menu';

export * from './legend';
export * from './menu';
export * from './popup';

export { Expression, ExpressionName } from 'mapbox-gl';
export {
  LayerProps,
  MapLayerMouseEvent,
  MapLayerTouchEvent,
  RMGPopupProps,
  SourceProps,
};

export type MapFormat = 'vector' | 'raster';

export type BasemapStyle = 'light' | 'dark' | 'streets';

export interface MapProps extends RMGMapProps {
  /**
   * ID of the mapbox style to use as a basemap.
   * @default 'light'
   **/
  basemapStyle?: BasemapStyle;

  mapRef?: React.RefObject<MapRef>;

  /** mapbox source props */
  sources?: SourceProps[];

  /**  Mapbox layer props */
  layers?: LayerProps[];

  /** Overlay(s) for custom controls to display in the options slot (directly left of map controls) */
  optionsMenu?: React.ReactNode | React.ReactNodeArray;

  /** Item(s) to display in the legend for custom layers */
  legendItems?: LegendItemProps[];

  hideLegendTitle?: boolean;

  /**
   * Style variant for built-in layer panel.
   *
   * @default LayerPanelVariant.Inside
   */
  layerPanelVariant?: LayerPanelVariant;

  /**
   * When true, event handlers will not ignore `PointerEvents` that do not have any associated feature data.
   * @default false
   */
  useFeaturelessEvents?: boolean;

  /**
   * [react-map-gl](http://visgl.github.io/react-map-gl/docs) components.
   *
   * Primarily [`Source`s](http://visgl.github.io/react-map-gl/docs/api-reference/source)
   * and [`Layer`s](http://visgl.github.io/react-map-gl/docs/api-reference/layer)
   */
  children?: React.ReactNode | React.ReactNodeArray;

  // new stuff todo: clean up once we get things going
  /**
   * Color scheme defines what color palette and what basemap to start with.
   * @default 'light'
   */
  colorScheme?: ColorScheme;

  CustomHoverContents?: PopupContentComponent;
  CustomClickContents?: PopupContentComponent;

  mapboxApiAccessToken?: string;
}

export interface LayerPanelProps {
}
