import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

import './main.css';
import styles from './GeographyPicker.module.css';

import classnames from 'classnames';

import { RiRoadMapFill as MapIcon } from 'react-icons/ri';

import { useField } from '@react-aria/label';
import { useButton } from '@react-aria/button';

import { Popover } from '@wprdc-components/popover';
import { GeogBrief } from '@wprdc-types/geo';

import { GeographyPickerProps } from '@wprdc-types/geography-picker';
import { GeographyPickerMenu } from './GeographyPickerMenu';

const PLACEHOLDER = 'Click here to search for a geography...';

export function GeographyPicker(props: GeographyPickerProps) {
  const [isOpen, setIsOpen] = useState<boolean>();
  const [geog, setGeog] = useState<GeogBrief>();
  const ref = React.useRef<HTMLButtonElement>(null);

  const { onSelection } = props;
  const onPress = () => setIsOpen(true);

  let { buttonProps } = useButton({ onPress, ...props }, ref);

  let { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField({ ...props, labelElementType: 'span' });

  useEffect(() => {
    if (props.selectedGeog) setGeog(props.selectedGeog);
  }, [props.selectedGeog]);

  const value: string | undefined = useMemo(
    () => geog && JSON.stringify(geog),
    [geog],
  );

  const displayValue: string | undefined = useMemo(
    () => (geog ? geog.title : PLACEHOLDER),
    [geog],
  );

  function handleSelection(geog: GeogBrief) {
    setGeog(geog);
    if (!!onSelection) {
      onSelection(geog);
    }
    setIsOpen(false);
  }

  return (
    <div className={styles.wrapper}>
      {props.label && (
        <div className={styles.label}>
          <span {...labelProps}>{props.label}</span>
        </div>
      )}
      <input hidden aria-hidden='true' {...fieldProps} value={value} />

      <button {...buttonProps} ref={ref} className={styles.input}>
        <span>
          <MapIcon aria-hidden='true' className={styles.icon} />
        </span>
        <span
          className={classnames(styles.value, {
            [styles.placeholder]: !geog,
          })}
        >
          {displayValue}
        </span>
      </button>
      {isOpen && (
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          isDismissable={true}
          isKeyboardDismissDisabled={true}
        >
          <GeographyPickerMenu
            selectedGeog={geog}
            onSelection={handleSelection}
          />
        </Popover>
      )}
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

export default GeographyPicker;
