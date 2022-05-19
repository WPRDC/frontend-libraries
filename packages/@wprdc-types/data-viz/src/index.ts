import { DataVizBase, DataVizData, Downloaded } from '@wprdc-types/viz';

import { GeogBrief } from '@wprdc-types/geo';
import { VizWrapperProps } from '@wprdc-types/viz';

export interface DataVizState {
  dataVizDataCache: DataVizDataCache;
}

/** Data and state of its collection for some dataviz at some geog*/
export interface DataVizDataRecord<
  T extends DataVizBase = DataVizBase,
  D extends DataVizData = DataVizData
> {
  dataViz: Downloaded<T, D>;
  isLoading: boolean;
  error?: string;
}

export type DataVizDataCache = Record<string, DataVizDataRecord>;

export type ContainerState = DataVizState;

export enum DataVizVariant {
  Default = 'default',
  Preview = 'preview',
  Blurb = 'blurb',
  Details = 'details',
  Card = 'card',
}

export enum AvailableDialogs {
  Report,
  Share,
  API,
}

export interface DataVizDetailsProps extends VizWrapperProps {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface DataVizMiniProps extends VizWrapperProps {}

export interface DataVizPreviewProps extends VizWrapperProps {}

export interface DataVizCardProps extends VizWrapperProps {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface DataVizStyleProps {}

export interface ConnectedDataVizProps {
  dataVizSlug?: string;
  geog?: GeogBrief;
  variant: DataVizVariant;
  showGeog?: boolean;
  onExplore?: (dataViz: DataVizBase) => unknown;
}

export interface MissingVizMessageProps {
  error?: string;
}
