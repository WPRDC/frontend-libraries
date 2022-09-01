import * as React from 'react';

import './main.css';
import styles from './ListSelect.module.css';

import { AriaListBoxOptions } from '@react-aria/listbox';
import { HiddenSelect, useSelect } from '@react-aria/select';
import { useSelectState } from '@react-stately/select';

import { StatelessListBox } from './StatelessListBox';
import { SelectProps } from '@wprdc-types/select';

export function ListSelect<T extends object, O extends object = {}>(
  props: SelectProps<T, O>,
) {
  // Create state based on the incoming props
  const { onSelection, listBoxProps } = props;

  const selectionShim = (key: React.Key) => {
    if (!!onSelection) {
      const node = state.collection.getItem(key);
      onSelection(node.value || key);
    }
  };

  const listBoxRef = React.useRef<HTMLUListElement>(null);

  const onSelectionChange = props.onSelectionChange || selectionShim;
  let state = useSelectState({ ...props, onSelectionChange });

  // Get props for child elements from useSelect
  let ref = React.useRef(null);
  let { labelProps, menuProps } = useSelect(props, state, ref);

  return (
    <div className={styles.container}>
      {!!props.label && (
        <div {...labelProps} className={styles.label}>
          {props.label}
        </div>
      )}
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <StatelessListBox<T, O>
        listBoxRef={listBoxRef}
        {...listBoxProps}
        {...(menuProps as AriaListBoxOptions<T>)}
        state={state}
      />
    </div>
  );
}
