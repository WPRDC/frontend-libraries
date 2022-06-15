/**
 *
 * BarChart
 *
 */
import * as React from 'react';
import '../main.css';
import styles from '../Vega.module.css';
import classNames from 'classnames';
import { Vega } from 'react-vega';
import Measure from 'react-measure';

import { BarChartProps } from '@wprdc-types/viz';

import columnSpec from './columnSpec';
import barSpec from './barSpec';
import { DataRecord, IndicatorWithData } from '@wprdc-types/profiles';

interface BarChartRecord extends DataRecord {
  geog: string;
  variable: string;
  time: string;

  variableLabel: string;
  variableAbbr?: string;
  timeLabel: string;
  geogLabel: string;
}

export function BarChart(props: BarChartProps) {
  const { indicator, inPreview } = props;
  const { options } = indicator;
  const { useColumns } = options;

  const [{ width, height }, setDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  const spec = useColumns ? columnSpec : barSpec;

  // flatten data for use in vega
  const table = flattenData(indicator);
  const labels = indicator.variables.map(v => ({
    var: v.slug,
    fullLabel: v.name,
    label: v.shortName || v.name,
  }));

  return (
    <div
      className={classNames(styles.wrapper, { [styles.inPreview]: inPreview })}
    >
      <Measure
        bounds
        onResize={contentRect => {
          if (contentRect.bounds) setDimensions(contentRect.bounds);
        }}
      >
        {({ measureRef }) => (
          <div
            ref={measureRef}
            className={styles.insideWrapper}
            aria-label="data presentation preview"
          >
            <Vega
              spec={spec}
              height={height - 7}
              width={width - 5}
              data={{ table, labels }}
              actions={false}
            />
          </div>
        )}
      </Measure>
    </div>
  );
}

function flattenData(indicator: IndicatorWithData) {
  let result: BarChartRecord[] = [];

  const { geog, time, vars } = indicator.dimensions;
  const { variables, timeAxis, geogs } = indicator;
  for (let g = 0; g < geog.length; g++) {
    for (let t = 0; t < time.length; t++) {
      for (let v = 0; v < vars.length; v++) {
        result.push({
          geog: geog[g],
          time: time[t],
          variable: vars[v],
          variableLabel: variables[v].name,
          variableAbbr: variables[v].shortName,
          timeLabel: timeAxis.timeParts[t].name,
          geogLabel: geogs[g].name,
          ...indicator.data[g][t][v],
        });
      }
    }
  }
  return result;
}
