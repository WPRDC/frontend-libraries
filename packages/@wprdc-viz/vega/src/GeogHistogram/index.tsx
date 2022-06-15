/**
 *
 * BarChart
 *
 */
import * as React from 'react';
import '../main.css';
import { PlainObject, Vega } from 'react-vega';

import { BarChartProps } from '@wprdc-types/viz';

import spec from './spec';
import { DataRecord, IndicatorWithData } from '@wprdc-types/profiles';

export function GeogHistogram(props: BarChartProps) {
  const { indicator } = props;

  const data = prepDataForVega(indicator);

  return <Vega spec={spec} data={data} actions={false} />;
}

/**
 * Copies and adds human-friendly labels to the tabular data provided from
 * the API and wraps it in the format Vega accepts.
 */
function prepDataForVega(indicator: IndicatorWithData): PlainObject {
  // todo: make lookup table for the labels and toss that into the vega spec!
  const addLabels = makeLabeler(indicator);
  // @ts-ignore
  return { table: indicator.data.map(addLabels) };
}

/**
 * Returns a function that extracts human-readable labels from `indicator`.
 */
const makeLabeler = (indicator: IndicatorWithData) => (datum: DataRecord) => {
  // todo: memoize these lookups
  const variable = indicator.variables[0];
  const time = indicator.timeAxis.timeParts[0];

  const variableLabel = variable.name;
  const timeLabel = time.name;

  return { ...datum, variableLabel, timeLabel };
};
