/**
 *
 * Dialog
 *
 * Modal dialog
 *
 */
import * as React from 'react';
import './main.css';

import styles from './Dialog.module.css';

import { useModal, useOverlay, usePreventScroll } from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';

import { DialogProps } from '@wprdc-types/dialog';
import { Heading } from '@wprdc-components/heading';
import classNames from 'classnames';

export const Dialog: React.FC<DialogProps> = props => {
  let {
    title,
    size = 'M',
    titleHeadingLevel = 2,
    withCloseButton = false,
    children,
  } = props;
  const sizeClass = `size-${size}`;

  let ref = React.useRef<HTMLDivElement>(null);

  usePreventScroll();
  let { overlayProps, underlayProps } = useOverlay(props, ref);
  let { modalProps } = useModal();
  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div className={styles.container} {...underlayProps}>
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          className={classNames([styles.modal, styles[sizeClass]])}
        >
          <div className={styles.header}>
            <Heading
              {...titleProps}
              level={titleHeadingLevel}
              className={styles.title}
            >
              {title}
            </Heading>
            {withCloseButton && (
              <button className={styles.closeButton}>X</button>
            )}
          </div>
          {children}
        </div>
      </FocusScope>
    </div>
  );
};

export default Dialog;
