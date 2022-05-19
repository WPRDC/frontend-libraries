/**
 *
 * BigValue
 *
 */
import React from 'react';

import './main.css';
import styles from './Value.module.css';

import { ValueVizProps } from '@wprdc-types/viz';
import classNames from 'classnames';

export function BigValue(props: ValueVizProps) {
  const { dataViz, inPreview } = props;
  const { data, options, error } = dataViz;

  if (!data || !data[0]) return <div />;
  if (!!error && !!error.level) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  const { variable, value, percent, denom } = data[0];
  const primaryVariable = dataViz.variables.find((v) => v.slug === variable);

  const denomVariable =
    primaryVariable && primaryVariable.denominators
      ? primaryVariable.denominators[0]
      : undefined;

  let displayValue: React.ReactNode;
  let displayPercent: React.ReactNode;
  let displayDenom: React.ReactNode;

  if (
    ['PLN', 'FRN', 'BTH'].includes(options.format) &&
    typeof value === 'number'
  ) {
    displayValue = (
      <span className={styles.value}>
        {value.toLocaleString(
          'en-US',
          primaryVariable ? primaryVariable.localeOptions : undefined
        )}
      </span>
    );
  }

  if (['PCT', 'BTH'].includes(options.format) && typeof percent === 'number') {
    const content = percent.toLocaleString('en-US', { style: 'percent' });
    const isShownAlone = options.format === 'PCT';
    displayPercent = (
      <span className={styles.value}>
        {isShownAlone ? (
          content
        ) : (
          <span className={styles.percent}>({content})</span>
        )}
      </span>
    );
  }

  if (['FRN', 'BTH'].includes(options.format) && typeof denom === 'number') {
    displayDenom = (
      <span className={styles.denom}>
        {'/ '}
        {denom.toLocaleString(
          'en-US',
          denomVariable ? denomVariable.localeOptions : undefined
        )}
      </span>
    );
  }
  return (
    <div
      className={classNames({
        [styles.inPreview]: inPreview,
      })}
    >
      <div>
        <p className={styles.name}>{dataViz.name}</p>
        <p className={styles.valueGroup}>
          {displayValue}
          {displayPercent}
          <br />
          {displayDenom}
        </p>
      </div>
    </div>
  );
}

export default BigValue;
