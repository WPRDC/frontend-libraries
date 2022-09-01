import * as React from 'react';

import { ListBoxProps } from '@wprdc-types/list-box';
import { useTreeState } from '@react-stately/tree';
import { Resource } from '@wprdc-types/shared';

import { StatelessListBox } from './StatelessListBox';

export function ListBox<T extends Resource, O extends object = {}>(
  props: ListBoxProps<T, O>,
): JSX.Element {
  const state = useTreeState<T>(props);
  let listBoxRef = React.useRef<HTMLUListElement>(null);

  return <StatelessListBox listBoxRef={listBoxRef} {...props} state={state} />;
}

export default ListBox;
