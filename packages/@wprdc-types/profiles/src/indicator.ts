import { Resource, TagRecord } from '@wprdc-types/shared';
import { GeogBrief } from '@wprdc-types/geo';
import { ContextItem } from './context';
import { TimeAxis } from './time';
import { Variable } from './variable';
import { SourceBase } from './source';
import {
  MapProps,
  SourceProps,
  LayerProps,
  LegendItemProps,
} from '@wprdc-types/map';

export enum Dimension {
  Variable = 'vars',
  Time = 'time',
  Geography = 'geog',
}

/** Mapping of dimensions to slugs for each of their parts */
export type DimensionRecord = Record<Dimension, string[]>;

/** Indicator type T with `data` required */
export interface IndicatorOptions {
  useColumns: boolean;
  useDenominators: boolean;
  isSingleValue: boolean;
  isSingleton: Record<Dimension, boolean>;
  isMappable: boolean;
  note?: string;
  mapOptions?: MapOptions;
  chartOptions?: ChartOptions;
}

/** Options from backend for styling maps */
export interface MapOptions {
  sources: SourceProps[];
  layers: LayerProps[];
  mapOptions: Partial<MapProps>;
  legends: LegendItemProps[];
  numberFormatOptions?: Partial<Intl.NumberFormatOptions>;
}

/** Options from backend for styling Vega charts */
export interface ChartOptions {
  // todo: make chart options
}

//
// API response structure
// ----------------------
/** Shared fields across all data vizes */
export interface IndicatorBase extends Resource {}

export interface IndicatorBaseWithOptions extends IndicatorBase {
  options: IndicatorOptions;
}

export interface Indicator extends IndicatorBase {
  tags: TagRecord[];
  childTags: TagRecord[];
  context: ContextItem[];
  timeAxis: TimeAxis;
  variables: Variable[];
  sources: SourceBase[];
  options: IndicatorOptions;
}

export interface IndicatorWithData extends Indicator {
  data: DataRecord[][][];
  options: IndicatorOptions;
  error: ErrorRecord;
  warnings: ErrorRecord;
  geogs: GeogBrief[];
  dimensions: DimensionRecord;
}

/** Error details reported from backend */
export interface ErrorRecord {
  status: string;
  level: number;
  message?: string;
}

/**
 * Mapping of axis option keys to slugs
 */
export type AxesSlugRecord = { [k in Dimension]: string };

//
// API response data format
// ================
/** Data provided to rows */
export interface DataRecord {
  /** Primary value */
  value: number;

  /** Optional margin of error value */
  moe?: number;

  /** Value for denominator part of denominator axis given unchanged other axes */
  denom?: number;

  /** value/denom */
  percent?: number;
}
