import * as React from 'react';
import { Key } from 'react';
import { Select } from './Select';
import { useAsyncList } from '@react-stately/data';
import { Resource } from '@wprdc-types/shared';
import { ConnectedSelectProps } from '@wprdc-types/select';
import { ResourceOptionTemplateOptions } from '@wprdc-types/list-box';

export function ConnectedSelect<T extends Resource,
  O extends object = ResourceOptionTemplateOptions<T>>(props: ConnectedSelectProps<T, O>) {
  const { connection, label, onSelection, listBoxProps, ...selectProps } =
    props;
  const list = useAsyncList<T>(connection);
  if (!!list.error) console.error(list.error);

  function handleSelection(key: Key) {
    if (!!onSelection) {
      onSelection(list.getItem(key));
    }
  }

  return (
    <Select<T, O>
      label={label}
      items={list.items}
      onLoadMore={list.loadMore}
      onSelectionChange={handleSelection}
      listBoxProps={listBoxProps}
      {...selectProps}
    >
      {connection.renderItem}
    </Select>
  );
}
