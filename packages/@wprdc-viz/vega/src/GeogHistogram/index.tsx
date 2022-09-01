/**
 *
 * BarChart
 *
 */
import * as React from 'react';
import '../main.css';
import { Vega } from 'react-vega';

import { BarChartProps } from '@wprdc-types/viz';

import { makeSpec } from './spec';
import { flattenData, useFilters } from '../util';
import styles from '../Vega.module.css';
import Measure from 'react-measure';
import classNames from 'classnames';

export function GeogHistogram(props: BarChartProps) {
  const {
    indicator,
    inPreview,
    selectedTimeParts,
    selectedVariables,
    onHover,
    hoveredRecord,
  } = props;

  function handleHover(_: string, datum: unknown) {
    if (!!onHover) onHover(datum as object);
  }

  const signalListeners = { hover: handleHover };

  const [{ width, height }, setDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  const { renderVariables, renderTimeParts } = useFilters(
    selectedVariables,
    selectedTimeParts,
  );

  const table = React.useMemo(
    () => flattenData(indicator, renderTimeParts, renderVariables),
    [indicator, renderVariables, renderTimeParts],
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
    [indicator.slug, renderVariables],
  );

  const highlight = { highlight: hoveredRecord?.geog };

  const spec = React.useMemo(
    () => makeSpec(indicator.options.useDenominators ? 'percent' : 'value'),
    [],
  );

  // TODO: highlight chart based on hover state

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
            aria-label='data presentation preview'
          >
            <Vega
              spec={spec}
              height={height - 7}
              width={width - 5}
              data={{ table, labels, highlight }}
              signalListeners={signalListeners}
            />
          </div>
        )}
      </Measure>
    </div>
  );
}
