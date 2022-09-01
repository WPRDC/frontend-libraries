/**
 *
 * Popover types
 *
 **/
import * as React from 'react';

import { AriaOverlayProps } from '@react-aria/overlays';

export interface PopoverProps extends AriaOverlayProps {
  popoverRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}
