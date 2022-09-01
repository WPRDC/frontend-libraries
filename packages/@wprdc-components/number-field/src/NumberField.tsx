/**
 *
 * Number-Field
 *
 * Form field for handling numeric data.
 *
 */
import * as React from 'react';
import './main.css';
import styles from './NumberField.module.css';

import classNames from 'classnames';

import { useNumberField } from '@react-aria/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';
import { useLocale } from '@react-aria/i18n';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { NumberFieldProps } from '@wprdc-types/number-field';

import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';

export const NumberField: React.FC<NumberFieldProps> = (props) => {
  const { locale } = useLocale();
  const state = useNumberFieldState({ ...props, locale });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const incrRef = React.useRef<HTMLButtonElement>(null);
  const decRef = React.useRef<HTMLButtonElement>(null);

  let { isFocusVisible, isFocused, focusProps } = useFocusRing();

  const {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
  } = useNumberField(props, state, inputRef);

  const { buttonProps: incrementProps } = useButton(
    incrementButtonProps,
    incrRef,
  );
  const { buttonProps: decrementProps } = useButton(
    decrementButtonProps,
    decRef,
  );

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} {...labelProps}>
        {props.label}
      </label>
      <div
        {...groupProps}
        className={classNames(styles.group, {
          [styles.focused]: isFocusVisible || isFocused,
        })}
      >
        <input
          className={styles.realInput}
          {...inputProps}
          {...focusProps}
          ref={inputRef}
        />
        <div className={styles.buttonSection}>
          <button className={styles.button} {...incrementProps} ref={decRef}>
            <RiArrowUpSFill className={styles.icon} />
          </button>
          <button className={styles.button} {...decrementProps} ref={incrRef}>
            <RiArrowDownSFill className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
};
