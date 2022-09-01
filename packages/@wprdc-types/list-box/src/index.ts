/**
 *
 * ListBox types
 *
 **/
import React, { Key, RefObject } from 'react';

import { AriaListBoxOptions, AriaListBoxSectionProps, AriaOptionProps } from '@react-aria/listbox';

import { CollectionChildren, Node } from '@react-types/shared';

import { ListState } from '@react-stately/list';
import { ListConnectableComponentProps, Resource } from '@wprdc-types/shared';
import { AriaSelectProps } from '@react-types/select';

/**
 * Set of list box props to allow parent components to control its appearance.
 *
 * T shape of object represent by list box.
 * P props for option template
 */
export interface ListBoxOptions<T, O extends object = {}> {
  /** Whether to make the list fill its parent's width */
  fullWidth?: boolean;
  loadingMessage?: string;
  dense?: boolean;
  /** Template to render the displayed value */
  optionTemplate?: OptionTemplate<T, O>;
  /** Options to send as props to `optionTemplate`s when used */
  optionTemplateOptions?: O;
}

/** Function that uses item to generate list box option text */
export type OptionFieldAccessor<T> = (item: T) => React.ReactNode;

export type OptionTemplateProps<T, O extends object = {}> = O & {
  item: T;
};

/** All option template types should derive from this */
export type OptionTemplate<T, O extends object = {}> = React.FC<OptionTemplateProps<T, O>>;

export interface ResourceOptionTemplateOptions<T extends Resource> {
  /**
   * Function that accepts a Resource object and returns an Icon component.
   *
   * If the function returns null or undefined, `Icon` or nothing will be used
   */
  getIcon?: (
    item: T,
  ) => React.FC<React.HTMLAttributes<HTMLOrSVGElement>> | null | undefined;
  /**
   * Icon component. Will be overridden by result of `getIcon` if `getIcon` is
   *   provided and returns a component.
   *
   * Setting this with getIcon will use it as a fallback/default.
   */
  Icon?: React.FC<{ item?: T } & React.HTMLAttributes<HTMLOrSVGElement>>;
  /**
   * Field in resource to use for the title
   *  or function to find/generate title text from item
   */
  titleAccessor?: keyof T | OptionFieldAccessor<T>;
  /**
   * Field in resource to use for the subtitle
   *  or function to find/generate subtitle text from item
   */
  subtitleAccessor?: keyof T | OptionFieldAccessor<T>;
}

// Component Props
export interface ListBoxProps<T, O extends object = {}>
  extends AriaListBoxOptions<T>,
    ListBoxOptions<T, O> {
  children: CollectionChildren<T>;
}

export interface ListSelectPros<T, O extends object = {}>
  extends AriaSelectProps<T> {
  /** Function run when an item is selected */
  onSelection?: (item: T) => void;
  /** Props to pass along to underlying list box */
  listBoxProps?: ListBoxOptions<T, O>;
}

export interface StatelessListBoxProps<T, O extends object = {}>
  extends AriaListBoxOptions<T>,
    ListBoxOptions<T, O> {
  /** Externally-managed state to render in the ListBox */
  state: ListBoxState<T>;
  /** Externally-managed ref to use for the listBox */
  listBoxRef?: RefObject<HTMLUListElement>;
}

export interface ListBoxSectionProps<T, O extends object>
  extends AriaListBoxSectionProps,
    ListBoxOptions<T, O> {
  section: Node<T>;
  state: ListState<T>;
}

export interface OptionProps<T, O extends object = {}>
  extends AriaOptionProps,
    ListBoxOptions<T, O> {
  item: Node<T>;
  state: ListState<T>;
  onAction?: (key: Key) => void;
}

/** Props for `ResourceOptionTemplate` */
export type ResourceOptionTemplateProps<T extends Resource> =
  OptionTemplateProps<T, ResourceOptionTemplateOptions<T>>;

// Misc

export interface ListBoxState<T> extends ListState<T> {
  // from SelectState in react-aria
  /** Whether the select is currently focused. */
  readonly isFocused?: boolean;

  /** Sets whether the select is focused. */
  setFocused?(isFocused: boolean): void;
}

export interface ConnectedListBoxProps<T extends Resource,
  O extends object = {}> extends ListConnectableComponentProps<T>,
  Omit<StatelessListBoxProps<T, O>, 'children'> {
  label?: string;
  /** Function run when an item is selected */
  onSelection?: (item: T) => void;
  /** Props to pass along to underlying list box */
  listBoxProps?: ListBoxOptions<T, O>;
}
