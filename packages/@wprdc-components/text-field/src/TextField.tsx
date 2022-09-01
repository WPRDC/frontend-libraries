/**
 *
 * Text-Field
 *
 * Form field for text input.
 *
 */
import * as React from 'react';

import './main.css';

import { TextFieldAria, useTextField } from '@react-aria/textfield';

import styles from './TextField.module.css';

import { TextFieldProps } from '@wprdc-types/text-field';

// mapping of possible html element names to their types.
type Elems = {
  input: HTMLInputElement;
  textarea: HTMLTextAreaElement;
};

export function TextField<T extends 'input' | 'textarea'>(
  props: TextFieldProps<T>,
) {
  const { label, inputElementType } = props;
  const ref = React.useRef<Elems[T]>(null);

  const { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField<T>(props, ref);

  const input = React.useMemo(() => {
    if (inputElementType === 'textarea')
      return (
        <textarea
          {...(inputProps as TextFieldAria<'textarea'>)}
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          className={styles.input}
        />
      );
    return (
      <input
        {...(inputProps as TextFieldAria<'input'>)}
        ref={ref as React.RefObject<HTMLInputElement>}
        className={styles.input}
      />
    );
  }, []);

  return (
    <div className={styles.wrapper}>
      <label {...labelProps} className={styles.label}>
        {label}
      </label>
      {input}
      {props.description && (
        <div {...descriptionProps} className={styles.description}>
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div {...errorMessageProps} className={styles.error}>
          {props.errorMessage}
        </div>
      )}
    </div>
  );
}
