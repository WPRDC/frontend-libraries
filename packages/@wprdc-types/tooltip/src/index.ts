/**
 *
 * Tooltip types
 *
 **/

import { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from 'react';
import { OverlayTriggerProps, PopoverProps as RTPopoverProps } from '@react-types/overlays';

interface TooltipPropsBase extends OverlayTriggerProps {
  title: string;
  content: ReactNode;
  popoverProps?: TooltipPopoverProps;
  size?: Size;
  button?: boolean;
}

export type TooltipProps = PropsWithChildren<TooltipPropsBase>;

export interface TooltipPopoverProps
  extends Omit<RTPopoverProps, 'children'>,
    ComponentPropsWithoutRef<'button'> {
  title?: string;
  onClose?: () => unknown;
  size?: Size;
}

type Size =
  | '0'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | 'full'
  | 'max';
