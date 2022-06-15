/*
 *
 * Series types
 *
 */
import { Resource, TagRecord } from '@wprdc-types/shared';
import { ContextItem } from './context';

export type Time = YearSeries; // union any more new series

export enum SeriesResourceType {
  YearSeries = 'YearSeries',
}

export interface SeriesBase extends Resource {
  resourcetype: SeriesResourceType;
}

export interface YearSeries extends SeriesBase {
  year: number;
  resourcetype: SeriesResourceType.YearSeries;
}

export interface TimePart {
  slug: string;
  name: string;
  timePoint: Date;
  timeUnit: number;
}

export interface TimeAxis extends Resource {
  unit: number;
  timeParts: TimePart[];
  tags: TagRecord[];
  context: ContextItem[];
}

export interface StaticTimeAxis extends TimeAxis {
  dates: Date[];
  start: Date;
  end: Date;
}

export interface StaticConsecutiveTimeAxis extends TimeAxis {
  start: Date;
  end: Date;
  ticks: number;
}

export interface RelativeTimeAxis extends TimeAxis {
  startOffset: number;
  ticks: number;
  direction: number;
}
