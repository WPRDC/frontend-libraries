import * as React from 'react';
import './main.css';

import styles from './Popover.module.css';

import { DismissButton, useOverlay } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';

import { PopoverProps } from '@wprdc-types/popover';

export function Popover(props: PopoverProps) {
  let ref = React.useRef<HTMLDivElement>(null);
  let { popoverRef = ref, children, onClose } = props;

  let { overlayProps } = useOverlay(props, popoverRef);

  return (
    <FocusScope restoreFocus>
      <div {...overlayProps} ref={popoverRef} className={styles.container}>
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}
