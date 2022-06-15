/**
 *
 * BigValue
 *
 */
import React from 'react';

import './main.css';
import styles from './Value.module.css';

import { BigValueProps } from '@wprdc-types/viz';
import classNames from 'classnames';
import { ErrorMessage } from '@wprdc-components/error-message';

export function BigValue(props: BigValueProps) {
  const { indicator, inPreview } = props;
  const { data, options, error } = indicator;
  const { note, useDenominators } = options;
  if (!data || !data[0]) return <div />;
  if (!!error && !!error.level) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data[0][0][0]) {
    return (
      <ErrorMessage
        title="Deprecated Indicator"
        message={`Indicator d should be removed`}
      />
    );
  }

  const { value, percent, denom } = data[0][0][0];
  const primaryVariable = indicator.variables[0];

  const denomVariable =
    primaryVariable && primaryVariable.denominators
      ? primaryVariable.denominators[0]
      : undefined;

  let content: React.ReactNode;
  if (
    useDenominators &&
    !!denomVariable &&
    typeof percent === 'number' &&
    typeof denom === 'number'
  ) {
    // put everything in content
    content = (
      <div>
        <span className={styles.percent}>
          {percent.toLocaleString('en-US', { style: 'percent' })}
        </span>
        <span className={styles.value}>
          {value.toLocaleString(
            'en-US',
            primaryVariable ? primaryVariable.numberFormatOptions : undefined
          )}
        </span>
        <span className={styles.denom}>
          {'/ '}
          {denom.toLocaleString(
            'en-US',
            denomVariable ? denomVariable.numberFormatOptions : undefined
          )}
        </span>
      </div>
    );
  } else {
    // just put the value
    content = (
      <span className={styles.percent}>
        {value.toLocaleString(
          'en-US',
          primaryVariable ? primaryVariable.numberFormatOptions : undefined
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
        <p className={styles.name}>{indicator.name}</p>
        <div className={styles.valueGroup}>{content}</div>
        {!!note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}

export default BigValue;
