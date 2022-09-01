/**
 *
 * LabeledValue types
 *
 **/
import { ReactNode } from 'react';

export interface DataChipProps {
  /** Value to display */
  value: ReactNode;

  /** Locale options to apply to value if it's a number */
  numberFormatOptions?: Intl.NumberFormatOptions;

  /** Icon to use as a visual label or the value. */
  icon?: DataChipIcon | ((props: any) => JSX.Element);

  /** Icon to use as a visual label or the value. */
  iconProps?: { [prop: string]: any }; // todo: set this up

  /** Label used to describe the value.  If not provided for styling purposes provide label aria-label. */
  label?: string;

  /** Label to use for accessibility. Will be `label` if provided. */
  'aria-label'?: string;

  /** URL related to value.  If provided, the label will be a link. */
  href?: string;

  /** When true, the DataChip will match its parent's width. */
  fullWidth?: boolean;

  /** When true, the DataChip will match its parent's width. */
  color?: 'primary' | 'secondary' | string;

  /**
   * Wrap with `dl` element instead of `div` if true.
   * When false or not provided, you must wrap with DataChipProvider in your app.
   */
  standalone?: boolean;

  size?: 'S' | 'M' | 'L';
}

export type DataChipIcon =
  | 'map'
  | 'phone'
  | 'contacts'
  | 'mail'
  | 'link'
  | 'person'
  | 'group'
  | 'community'
  | 'bus'
  | 'database';
