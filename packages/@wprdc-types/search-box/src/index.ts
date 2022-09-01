/**
 *
 * SearchBox types
 *
 **/
import { LoadingState } from '@react-types/shared';
import { ListConnectableComponentProps, Resource } from '@wprdc-types/shared';
import { ListBoxOptions } from '@wprdc-types/list-box';
import { ComboBoxProps } from '@wprdc-types/combo-box';

export interface SearchBoxProps<T extends Resource, O extends object = {}>
  extends ComboBoxProps<T, O> {
  label?: string;
  loadingState?: LoadingState;
  onLoadMore?: () => void;
  children: (item: T) => JSX.Element;
}

export interface ConnectedSearchBoxProps<T extends Resource,
  O extends object = {}> extends ListConnectableComponentProps<T>,
  Omit<SearchBoxProps<T, O>, 'children'> {
  label?: string;
  onSelection?: (item: T) => unknown;
  /** Props to pass along to underlying list box */
  listBoxProps?: ListBoxOptions<T, O>;
}
