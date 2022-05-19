/**
 *
 * Button
 *
 * Press it
 *
 */
import * as React from 'react';
import { useRef } from 'react';

import './main.css';
import styles from './Button.module.css';

import classNames from 'classnames';

import { useButton } from '@react-aria/button';
import { ButtonProps } from '@wprdc-types/button';

export function Button(props: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { children, color = 'default' } = props;

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={
        color === 'none'
          ? ''
          : classNames([
              styles.wrapper,
              {
                [styles.elevated]: props.elevated,
                [styles.dense]: props.dense,
              },
              styles[color],
            ])
      }
    >
      {children}
    </button>
  );
}
