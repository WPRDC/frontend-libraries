import React from 'react';

import { BackgroundColorValue, ViewStyleProps } from '@react-types/shared';

export interface MultiLegendProps extends ViewStyleProps {
  title?: React.ReactNode;
  legends?: JSX.Element[];
  numberFormatOptions?: Partial<Intl.NumberFormatOptions>;
}

export interface LegendProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export interface LegendItemListProps {
  title?: string;
  items?: LegendItemProps[];
}

export type LegendItemProps =
  | CategoricalLegendItemProps
  | ColorScaleLegendItemProps;

export interface LegendItemBase {
  key?: React.Key;
  /** The text or component that describes the item */
  label: React.ReactNode;
}

export interface CategoricalLegendItemProps extends LegendItemBase {
  variant: 'categorical';
  /** Icon or image. if css color string provided, a circle of that color will be used */
  marker: React.ReactNode | BackgroundColorValue;
  /** Whether to make a simple color marker hollow (e.g. for polygon border colors */
  hollow?: boolean;
}

export interface ColorScaleLegendItemProps extends LegendItemBase {
  variant: 'scale';
  /** The array of steps that make up the scale */
  scale: Omit<CategoricalLegendItemProps, 'variant'>[];
  /** Locale settings */
  numberFormatOptions?: Partial<Intl.NumberFormatOptions>;
}
