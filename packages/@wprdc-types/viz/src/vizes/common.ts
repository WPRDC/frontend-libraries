import { TimeAxis } from '../time';
import { VizVariable } from '../variable';
import { SourceBase } from '../source';
import { DataVizType, Resource } from '@wprdc-types/shared';

//
// API response structure
// ----------------------
/** Minimal data on a data viz */
export interface DataVizID extends Resource<number> {
  vizType: DataVizType;
}

export interface DataVizIDWithSources extends DataVizID {
  Sources: SourceBase[];
}

/** Shared fields across all data vizes */
export interface DataVizBase extends DataVizID {
  staticOptions?: Record<string, any>;
  timeAxis: TimeAxis;
  variables: VizVariable[];
  sources: SourceBase[];
}

/** Error details reported from backend */
export interface ErrorRecord {
  status: string;
  level: number;
  message?: string;
}

export enum AxisOption {
  Variable = 'variable',
  Time = 'time',
  Geography = 'geog',
}

/**
 * Mapping of axis option keys to slugs
 */
export type AxesSlugRecord = { [k in AxisOption]: string };

//
// API response data format
// ================
/** Data provided to rows */
export interface RowRecord extends AxesSlugRecord {
  /** Primary value */
  value: number;

  /** Optional margin of error value */
  moe?: number;

  /** Value for denominator part of denominator axis given unchanged other axes */
  denom?: number;

  /** value/denom */
  percent?: number;
}

/** Collection of rows */
export type TabularData = RowRecord[];
