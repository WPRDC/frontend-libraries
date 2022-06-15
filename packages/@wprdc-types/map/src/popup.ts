import { PopupProps as RMGPopupProps } from 'react-map-gl/src/components/popup';
import { MapLayerMouseEvent } from 'react-map-gl';
import React from 'react';

export interface PopupProps extends RMGPopupProps {}

export interface HoverPopupProps extends PopupProps {}

export interface ClickPopupProps extends PopupProps {}

export interface PopupSectionProps {
  /** Label to show above list. */
  label: string;
  /** Icon next to label. */
  icon?: (props: any) => JSX.Element;
  children?: React.ReactChild;
}

export interface PopupContentProps<
  G extends GeoJSON.Geometry | null = GeoJSON.Geometry,
  P = GeoJSON.GeoJsonProperties
> {
  /** Event responsible for this popup. */
  event: MapLayerMouseEvent;
  /**
   * The features associated withe the event.
   * (shortcut - should be set `event.features`
   */
  features: GeoJSON.Feature<G, P>[] | unknown[];
  /**
   * The `properties` attached to the first feature from `event.features`.
   *  (shortcut - should be same as `event.features[0].properties]
   */
  primaryFeatureProps: P;
}

export type PopupContentComponent<
  P extends PopupContentProps = PopupContentProps
> = React.FC<P>;

export interface UserPopupContentProps {
  getLabel?: (eventData: PopupContentProps) => React.ReactNode;
  getDescription?: (eventData: PopupContentProps) => React.ReactNode;
  getIcon?: (eventData: PopupContentProps) => React.ReactNode;
}

export type ExtendedPopupContentProps = PopupContentProps &
  UserPopupContentProps;
