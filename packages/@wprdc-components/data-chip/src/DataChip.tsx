/**
 *
 * LabeledValue
 *
 * [ Shows a value with a label and or icon. ]
 *
 */

import * as React from 'react';
import './main.css';
import styles from './DataChip.module.css';
import classNames from 'classnames';
import { icons } from './icons';
import { DataChipProps } from '@wprdc-types/data-chip';

export const DataChip: React.FC<DataChipProps> = (props) => {
  const {
    value,
    numberFormatOptions,
    icon,
    iconProps,
    label,
    href,
    fullWidth,
    standalone,
    size = 'M',
  } = props;

  let displayValue = value;
  if (numberFormatOptions && typeof value === 'number') {
    displayValue = value.toLocaleString('en-US', numberFormatOptions);
  }

  const title = `${displayValue}`;
  const Icon = typeof icon === 'string' ? icons[icon] : icon;
  const Wrapper = !!standalone ? 'dl' : 'div';
  return (
    <Wrapper
      className={classNames(styles.wrapper, styles[`size-${size}`], {
        [styles.full]: fullWidth,
      })}
    >
      <div className={classNames(styles.label)}>
        {!!Icon && <Icon {...iconProps} className={styles.icon} />}
        {!!label && <div className={styles.labelText}>{label}</div>}
      </div>
      <div className={styles.value}>
        {!!href ? (
          <a href={href} title={title}>
            {displayValue}
          </a>
        ) : (
          <p className={styles.valueText} title={title}>
            {displayValue}
          </p>
        )}
      </div>
    </Wrapper>
  );
};
