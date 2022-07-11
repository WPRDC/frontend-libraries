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
import { flattenData, useFilters } from '../util';

export function BarChart(props: BarChartProps) {
  const { indicator, inPreview, selectedTimeParts, selectedVariables } = props;
  const { options } = indicator;
  const { useColumns } = options;
  const spec = useColumns ? columnSpec : barSpec;

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
      indicator.variables
        .filter(v => renderVariables.has(v.slug))
        .map(v => ({
          var: v.slug,
          fullLabel: v.name,
          label: v.shortName || v.name,
        })),
    [indicator.slug, renderVariables]
  );

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
