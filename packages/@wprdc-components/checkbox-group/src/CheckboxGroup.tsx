/**
 *
 * CheckboxGroup
 *
 * A group of checkboxes
 *
 */
import * as React from 'react';
import './main.css';
import styles from './CheckboxGroup.module.css';

import classNames from 'classnames';

import {
  CheckboxGroupState,
  useCheckboxGroupState,
} from '@react-stately/checkbox';

import { useCheckboxGroup, useCheckboxGroupItem } from '@react-aria/checkbox';

import { CheckboxGroupProps, CheckboxProps } from '@wprdc-types/checkbox-group';

const CheckboxGroupContext =
  React.createContext<CheckboxGroupState | null>(null);

export function CheckboxGroup(props: CheckboxGroupProps) {
  const { children, label, items } = props;
  const state = useCheckboxGroupState(props);
  const { groupProps, labelProps } = useCheckboxGroup(props, state);

  return (
    <div {...groupProps} className={styles.container}>
      <span {...labelProps} className={styles.label}>
        {label}
      </span>
      <CheckboxGroupContext.Provider value={state}>
        <div className={styles.itemsWrapper}>
          {children || (items && items.map((item) => <Checkbox {...item} />))}
        </div>
      </CheckboxGroupContext.Provider>
    </div>
  );
}

export function Checkbox(props: CheckboxProps) {
  const { children, label } = props;
  const state = React.useContext(CheckboxGroupContext) as CheckboxGroupState;
  const ref = React.useRef<HTMLInputElement>(null);
  const { inputProps } = useCheckboxGroupItem(props, state, ref);

  const isDisabled = state.isDisabled || props.isDisabled;

  return (
    <label
      style={{
        color: (isDisabled && 'gray') || undefined,
      }}
      className={styles.itemLabel}
    >
      <div className={styles.inputDiv}>
        <input
          {...inputProps}
          ref={ref}
          className={classNames(styles.input, {
            [styles.disabledInput]: isDisabled,
          })}
        />
        <div className={styles.checkmark}></div>
      </div>
      <div>{children || label}</div>
    </label>
  );
}

export default CheckboxGroup;
