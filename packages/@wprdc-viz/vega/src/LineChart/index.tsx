/**
 *
 * LineChart
 *
 */
import * as React from 'react';
import '../main.css';
import styles from '../Vega.module.css';
import classNames from 'classnames';
import { Vega } from 'react-vega';
import Measure from 'react-measure';

import { LineChartProps } from '@wprdc-types/viz';

import spec from './spec';
import { flattenData, useFilters } from '../util';

export function LineChart(props: LineChartProps) {
  const { indicator, inPreview, selectedTimeParts, selectedVariables } = props;
  const [{ width, height }, setDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  const { renderVariables, renderTimeParts } = useFilters(
    selectedVariables,
    selectedTimeParts
  );

  // flatten data for use in vega
  const table = React.useMemo(
    () => flattenData(indicator, renderTimeParts, renderVariables),
    [indicator, renderVariables, renderTimeParts]
  );

  const labels = React.useMemo(
    () =>
      indicator.timeAxis.timeParts
        .filter(t => renderTimeParts.has(t.slug))
        .map(t => ({
          timePoint: t.timePoint,
          fullLabel: t.name,
          label: t.name,
        })),
    [indicator.slug, renderTimeParts]
  );

  console.log(table, labels, spec);

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
