/**
 *
 * Dialog types
 *
 **/
import { OverlayProps } from '@react-aria/overlays';
import { AriaDialogProps } from '@react-types/dialog';
import { HeadingLevel } from '@wprdc-types/heading';

export interface DialogProps extends AriaDialogProps, OverlayProps {
  title?: string;
  withCloseButton?: boolean;
  size?: 'S' | 'M' | 'L' | 'XL' | 'Full';
  titleHeadingLevel?: HeadingLevel;
  children?: React.ReactNode;
}
