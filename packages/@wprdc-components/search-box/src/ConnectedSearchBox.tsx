import * as React from 'react';
import { Key } from 'react';
import { SearchBox } from './SearchBox';
import { useAsyncList } from '@react-stately/data';
import { ConnectedSearchBoxProps } from '@wprdc-types/search-box';
import { Resource } from '@wprdc-types/shared';
import { ResourceOptionTemplateOptions } from '@wprdc-types/list-box';

export function ConnectedSearchBox<T extends Resource,
  O extends object = ResourceOptionTemplateOptions<T>>(props: ConnectedSearchBoxProps<T, O>) {
  const {
    connection,
    label,
    onSelection,
    listBoxProps,
    inputValue: propsValue,
    selectedKey: propsKey,
    ...searchBoxProps
  } = props;
  const [selectedKey, setSelectedKey] = React.useState<Key | undefined>();
  const [selectedFilterText, setSelectedFilterText] =
    React.useState<string | undefined>();

  const list = useAsyncList<T>(connection);

  if (!!list.error) console.error(list.error);

  function handleSelection(key: Key) {
    const item = list.getItem(key);
    if (!item) return;
    let filterText = item.name;
    if (!!connection.getFilterTextFromItem)
      filterText = connection.getFilterTextFromItem(list.getItem(key));

    setSelectedKey(key);
    setSelectedFilterText(filterText);
    if (!!onSelection) {
      onSelection(list.getItem(key));
    }
  }

  function handleInputChange(input: string) {
    setSelectedFilterText(undefined);
    list.setFilterText(input);
  }

  return (
    <SearchBox<T, O>
      label={label}
      items={list.items}
      onInputChange={handleInputChange}
      loadingState={list.loadingState}
      onLoadMore={list.loadMore}
      listBoxProps={listBoxProps}
      {...searchBoxProps}
      selectedKey={selectedKey}
      inputValue={selectedFilterText || list.filterText}
      onSelectionChange={handleSelection}
    >
      {connection.renderItem}
    </SearchBox>
  );
}

export default ConnectedSearchBox;
