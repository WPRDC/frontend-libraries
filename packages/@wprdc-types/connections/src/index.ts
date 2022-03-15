import React from 'react';

import { Expression } from 'mapbox-gl';
import { LayerProps, MapLayerMouseEvent, SourceProps } from 'react-map-gl';

import { Selection } from '@react-types/shared';

import { Resource, ProjectKey } from '@wprdc-types/shared';
import { GeogBrief } from '@wprdc-types/geo';
import {
  MapProps,
  LegendItemProps,
  LegendProps,
  PopupProps,
  HoverPopupProps,
  ClickPopupProps,
  PopupContentComponent,
  LayerPanelProps,
} from '@wprdc-types/map';
import { DataVizID } from '@wprdc-types/viz';
import { AssetType } from '@wprdc-types/neighborhood-assets';
import { ProjectIndex } from '@wprdc-types/housecat';

export interface ConnectableMapProps extends MapProps {
  onHover?: ConnectedMapEventHandler;
  onClick?: ConnectedMapEventHandler;
  connections?: ConnectionCollection;
  connectionHookArgs?: ConnectionArgProps;
}

export type MapPluginGetter<T extends Resource, R> = (
  items: T[],
  selected: Selection,
  callback: (r: R) => any,
  context?: MapPluginContext
) => any;

export type MapPluginHook<T extends Resource, E> = (
  args: MapPluginHookArgs<T, E>
) => MapPluginToolbox<T, E>;

/** Args for MapPluginConnection.use() */
export interface MapPluginHookArgs<T extends Resource, E>
  extends ContextArgs,
    ConnectionProps<T, E> {
  /** Collection of project specific methods and values */
  connection: MapPluginConnection<T, E>;
}

/** Args passed from outside to control hooks */
export interface ConnectionProps<
  T extends Resource = Resource,
  E = any,
  O extends Record<string, any> = Record<string, any>
> {
  /** List of objects that represent the layers for the plugin */
  layerItems?: T[];

  /** Selection object representing set of keys of the selected layers */
  layerSelection?: Selection;

  /** The selected item if controlled from outside scope */
  selectedMapItem?: E;

  /** Filter for MapboxStyle to display hover state */
  hoverFilter?: Expression;

  /** Filter for MapboxStyle to display selected state */
  selectedFilter?: Expression;

  /** Plugin-specific options */
  options?: O;
}

export type MapPluginContext = Record<string, any>;

export interface ContextArgs {
  /** state shared between plugins */
  context: Record<string, any>;
  /** setter used to update context */
  setContext: React.Dispatch<React.SetStateAction<MapPluginContext>>;
}

export type ConnectionHookArgs<T extends Resource, E> = ConnectionProps<T, E> &
  ContextArgs;

export interface MapPluginConnection<T extends Resource, E> {
  /** Name used to identify plugin */
  name: ProjectKey;

  use: MapPluginHook<T, E>;

  /** Generate MapBox sources based on state of interaction */
  getSources: MapPluginGetter<T, SourceProps[]>;

  /** Generate MapBox layers based on state of interaction */
  getLayers: MapPluginGetter<T, LayerProps[]>;

  /** Generate legend item data based on selected categories of type T */
  getLegendItems: MapPluginGetter<T, LegendItemProps[]>;

  /** Get array of Layer IDs that the user can interact with.*/
  getInteractiveLayerIDs: (items: T[], selected: Selection) => string[];

  /** Function to read MapEvent data and extract project items from it */
  parseMapEvent: (event: MapLayerMouseEvent, ctx?: MapPluginContext) => E[];

  /** Make mapbox filter expression that limits map to item or items provided. */
  makeFilter: (item: E[] | E) => Expression;

  /** Generates a LegendSection populated with LegendItems corresponding to provided layers */
  makeLegendSection: (
    setLegendSection: (elem?: JSX.Element) => void,
    items?: LegendItemProps[]
  ) => void | null;

  /** Make element containing the react-map-gl Source and Layer for rendering. */
  makeMapSection: (
    /** useState setter from hook to save results */
    setMapSection: (elem?: JSX.Element) => void,
    sources?: SourceProps[],
    layers?: LayerProps[]
  ) => void | null;

  /** Function that uses the current selection to filter the fulls set of items. */
  getSelectedItems: (items: T[], selection: Selection) => T[];

  /** Generates a LegendSection populated with LegendItems corresponding to provided layers */
  makeLayerPanelSection: LayerPanelSectionMaker<T>;

  /** Generates content for hover popup */
  makeHoverContent: (
    hoveredItems: E[],
    event: MapLayerMouseEvent
  ) => JSX.Element | null;

  /** Generates content for hover popup */
  makeClickContent: (
    clickedItems: E[],
    event: MapLayerMouseEvent
  ) => JSX.Element | null;
}

export type LayerPanelChangeHandler = (value: string | string[]) => void;

export type LayerPanelSectionMaker<T extends Resource> = (
  /** useState setter from hook to save results */
  setLayerPanelSection: (elem?: JSX.Element) => void,
  items?: T[],
  selectedItems?: T[],
  handleChange?: (selection: Selection) => void
) => void;

/**
 * Data and functions provided by  MapPluginConnection hooks
 */
export interface MapPluginToolbox<T extends Resource, E> {
  /** name of project associated with toolbox */
  name: ProjectKey;

  /** Items that represent layers on the map */
  layerItems?: T[];

  /** Mapbox source props generated by plugin */
  sources?: SourceProps[];

  /** Mapbox layer props generated by plugin */
  layers?: LayerProps[];

  /** LegendItem props generated by the plugin */
  legendItems?: LegendItemProps[];

  /** IDs of interactive layers in `layers` */
  interactiveLayerIDs: string[];

  /** Generated map section containing react tree with react-map-gl source and layers components. */
  mapSection?: JSX.Element | null;

  /** Callback fired when a layer is selected */
  handleLayerSelection: (selection: Selection) => void;

  /** Callback fired on hover events */
  handleHover: (event: MapLayerMouseEvent) => E[];

  /** Callback fired on click events */
  handleClick: (event: MapLayerMouseEvent) => E[];

  /**  */
  content?: JSX.Element;

  /** Generated legend content for this plugin */
  legendSection?: React.ReactNode;

  /** Generated legend content for this plugin */
  layerPanelSection?: React.ReactNode;

  /** Collection of item objects that are selected */
  selectedItems?: T[];

  /** Generates content for hover popup */
  makeHoverContent: (
    hoveredItems: E[],
    event: MapLayerMouseEvent
  ) => JSX.Element | null;

  /** Generates content for hover popup */
  makeClickContent: (
    clickedItems: E[],
    event: MapLayerMouseEvent
  ) => JSX.Element | null;
}

export interface APIMapBoxResponse {
  source: SourceProps;
  layers: (LayerProps & { 'source-layer': string; id: string })[];
  extras: {
    legendItems: LegendItemProps[];
  };
}

export type WithToolboxes<T> = T & {
  toolboxes: MapPluginToolbox<any, any>[];
};

export type ConnectionCollection = MapPluginConnection<any, any>[];

export type Connected<T> = T & {
  connections?: ConnectionCollection;
};

export interface ConnectionResourcesRecord {
  [ProjectKey.GeoMenu]: GeogBrief[];
  [ProjectKey.Viz]: DataVizID[];
  [ProjectKey.NeighborhoodAssets]: AssetType[];
  [ProjectKey.Housecat]: ProjectIndex[];
  // todo: add projects here as we need them
}

export type ConnectionArgProps = Partial<Record<ProjectKey, ConnectionProps>>;

export type ConnectedMapEventHandler = (
  evt: MapLayerMouseEvent,
  toolboxes?: MapPluginToolbox<any, any>[],
  toolboxItems?: Partial<ConnectionResourcesRecord>
) => void;

export type ConnectedLegendProps = WithToolboxes<LegendProps>;

export type ConnectedPopupProps = Connected<PopupProps>;
export type ConnectedHoverPopupProps = Connected<HoverPopupProps>;
export type ConnectedClickPopupProps = Connected<ClickPopupProps>;

export type MouseEventHandler = (
  eventType: 'click' | 'hover',
  event: MapLayerMouseEvent,
  Popup: React.FC<ConnectedPopupProps>,
  setPopup: React.Dispatch<JSX.Element | null | undefined>,
  CustomContentComponent?: PopupContentComponent,
  callback?: ConnectedMapEventHandler
) => void;

export type ConnectedLayerPanelProps = WithToolboxes<LayerPanelProps>;
