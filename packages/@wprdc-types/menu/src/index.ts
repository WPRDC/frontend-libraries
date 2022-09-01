/**
 *
 * Menu types
 *
 **/
import { Key } from 'react';
import { AriaMenuProps } from '@react-types/menu';
import { TreeState } from '@react-stately/tree';
import { Node } from '@react-types/shared';
import { AriaMenuItemProps, AriaMenuSectionProps } from '@react-aria/menu';

export interface MenuProps<T> extends AriaMenuProps<T> {
}

export interface MenuSectionProps<T> extends AriaMenuSectionProps {
  section: Node<T>;
  state: TreeState<T>;
  onAction?: (key: Key) => void;
}

export interface MenuItemProps<T> extends AriaMenuItemProps {
  item: Node<T>;
  state: TreeState<T>;
  onAction?: (key: Key) => void;
}
