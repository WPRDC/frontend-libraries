import * as React from 'react';

import './main.css';

import { useComboBoxState } from '@react-stately/combobox';

import { useFilter } from '@react-aria/i18n';
import { useComboBox } from '@react-aria/combobox';
import { useButton } from '@react-aria/button';

import { Popover } from '@wprdc-components/popover';
import { StatelessListBox } from '@wprdc-components/list-box';
import { ComboBoxProps } from '@wprdc-types/combo-box';
import { Resource } from '@wprdc-types/shared';

export function ComboBox<T extends Resource>(props: ComboBoxProps<T>) {
  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState({ ...props, defaultFilter: contains });

  let buttonRef = React.useRef(null);
  let inputRef = React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef<HTMLDivElement>(null);

  let {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state,
  );

  let { buttonProps } = useButton(triggerProps, buttonRef);

  return (
    <div className='inline-flex flex-col relative border-2 border-black'>
      <label
        {...labelProps}
        className='block text-xs font-mono text-gray-700 text-left'
      >
        {props.label}
      </label>
      <div
        className={`relative inline-flex flex-row rounded-md overflow-hidden shadow-sm border-2 border-black`}
      >
        <input
          {...inputProps}
          ref={inputRef}
          className='outline-none px-3 py-1'
        />
        <button
          {...buttonProps}
          ref={buttonRef}
          className={`px-1 bg-gray-100 cursor-default border-l-2 ${
            state.isFocused
              ? 'border-pink-500 text-pink-600'
              : 'border-gray-300 text-gray-500'
          }`}
        >
          {/*<RiArrowDropDownLine className="w-5 h-5" aria-hidden="true" />*/}
        </button>
      </div>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          isOpen={state.isOpen}
          onClose={state.close}
        >
          <StatelessListBox
            {...listBoxProps}
            listBoxRef={listBoxRef}
            state={state}
          />
        </Popover>
      )}
    </div>
  );
}

export default ComboBox;
