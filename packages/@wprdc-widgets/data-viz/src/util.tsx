import React from 'react';

import { Chart } from '@wprdc-viz/chart';
import { MiniMap } from '@wprdc-viz/mini-map';
import { Table } from '@wprdc-viz/table';
import { Sentence } from '@wprdc-viz/sentence';
import { BigValue } from '@wprdc-viz/value';

import { DataVizMini } from './mini';
import { DataVizPreview } from './preview';
import { DataVizDetails } from './details';
import { DataVizCard } from './card';

import { DataVizVariant } from '@wprdc-types/data-viz';
import { GeogBrief } from '@wprdc-types/geo';
import { DataVizType } from '@wprdc-types/shared';
import {
  DataVizBase,
  DataVizID,
  Downloaded,
  ErrorRecord,
  RowRecord,
  Variable,
  VizWrapperProps,
} from '@wprdc-types/viz';

import { Message } from './message';

export function getSpecificDataViz(
  dataViz?: Downloaded<DataVizBase>,
  error?: ErrorRecord
) {
  if (!!error) return Message;
  if (!dataViz) return undefined;

  const componentMap: Record<DataVizType, React.FC<any>> = {
    [DataVizType.BarChart]: Chart,
    [DataVizType.LineChart]: Chart,
    [DataVizType.PieChart]: Chart,
    [DataVizType.PyramidChart]: Chart,
    [DataVizType.ScatterPlot]: Chart,
    [DataVizType.Histogram]: Chart,
    [DataVizType.BigValue]: BigValue,
    [DataVizType.MiniMap]: MiniMap,
    [DataVizType.Table]: Table,
    [DataVizType.Sentence]: Sentence,
  };
  return componentMap[dataViz.vizType];
}

export function makeKey(dataVizID: DataVizID, geog: GeogBrief) {
  return `${dataVizID.slug}@${geog.geogType}/${geog.geogID}`;
}

/**
 * Formats `value` for `variable` per styling data extracted from `variable`.
 * @param {Variable} variable
 * @param {number} value
 */
export function formatValue(
  variable: Variable,
  value?: string | number | Date
): React.ReactNode {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
    case 'object':
      return value.toLocaleString(
        undefined,
        variable.localeOptions || undefined
      );
    default:
      return 'N/A';
  }
}

/**
 * Returns the DataViz component based on the supplied variant.
 *
 * @param {DataVizVariant} variant
 */
export function getVariantComponent(
  variant: DataVizVariant
):
  | React.MemoExoticComponent<(props: VizWrapperProps) => JSX.Element>
  | ((props: VizWrapperProps) => JSX.Element) {
  switch (variant) {
    case DataVizVariant.Blurb:
      return DataVizMini;
    case DataVizVariant.Preview:
      return DataVizPreview;
    case DataVizVariant.Details:
      return DataVizDetails;
    case DataVizVariant.Card:
    case DataVizVariant.Default:
    default:
      return DataVizCard;
  }
}

export function dumpCSV(data: RowRecord[]): string {
  return data.reduce((csv, row, i) => {
    if (i === 0) {
      return `${_csvHeader(row)}\n${_csvRow(row)}`;
    }
    return `${csv}\n${_csvRow(row)}`;
  }, '');
}

function _csvHeader(row: RowRecord): string {
  return Object.keys(row)
    .map((k) => `"${k}"`)
    .join(',');
}

function _csvRow(row: RowRecord): string {
  return Object.values(row)
    .map((v) => (typeof v === 'string' ? `"${v}` : v))
    .join(',');
}

/**
 * Determine whether a dataViz type uses Vega
 */
export function isVega(vizType?: DataVizType): boolean {
  if (vizType)
    return [
      DataVizType.BarChart,
      DataVizType.LineChart,
      DataVizType.PieChart,
      DataVizType.PyramidChart,
      DataVizType.ScatterPlot,
      DataVizType.Histogram,
    ].includes(vizType);
  return false;
}
