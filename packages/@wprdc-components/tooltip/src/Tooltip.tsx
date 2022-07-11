/**
 *
 * Tooltip
 *
 * Little popover with extra information
 *
 */
import React, { MutableRefObject } from 'react';

import './main.css';
import styles from './Tooltip.module.css';

import classNames from 'classnames';

import { useOverlayTriggerState } from '@react-stately/overlays';
import { FocusScope } from '@react-aria/focus';
import { useButton } from '@react-aria/button';
import { mergeProps } from '@react-aria/utils';
import {
  DismissButton,
  OverlayContainer,
  useModal,
  useOverlay,
  useOverlayPosition,
  useOverlayTrigger,
} from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';

import { TooltipPopoverProps, TooltipProps } from '@wprdc-types/tooltip';

const TooltipPopover = React.forwardRef<HTMLDivElement, TooltipPopoverProps>(
  (
    { title, size = 'md', children, isOpen, onClose, style, ...otherProps },
    ref
  ) => {
    const { overlayProps } = useOverlay(
      {
        onClose,
        isOpen,
        isDismissable: true,
      },
      ref as MutableRefObject<HTMLDivElement>
    );

    const { modalProps } = useModal();

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog(
      {},
      ref as MutableRefObject<HTMLDivElement>
    );

    return (
      <FocusScope restoreFocus>
        <div
          className={classNames(styles.popover, `max-w-${size}`)}
          {...mergeProps(overlayProps, dialogProps, otherProps, modalProps)}
          ref={ref as MutableRefObject<HTMLDivElement>}
          style={{ ...style }}
        >
          <div role="heading" {...titleProps} className={styles.popoverTitle}>
            {title}
          </div>
          {children}
          <DismissButton onDismiss={onClose} />
        </div>
      </FocusScope>
    );
  }
);

export function Tooltip(props: TooltipProps) {
  const {
    children,
    content,
    popoverProps,
    title,
    size,
    button = false,
  } = props;

  const state = useOverlayTriggerState(props);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  );

  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'top',
    offset: 5,
    isOpen: state.isOpen,
  });

  // if using `button` variant, use Button compoment, else use button html elem
  const { buttonProps } = useButton(
    {
      onPress: () => state.open(),
    },
    triggerRef
  );
  return (
    <>
      <button
        {...buttonProps}
        {...triggerProps}
        ref={triggerRef}
        className={button ? styles.button : styles.wrapper}
      >
        {children}
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <TooltipPopover
            {...popoverProps}
            {...overlayProps}
            {...positionProps}
            ref={overlayRef}
            title={title}
            size={size}
            isOpen={state.isOpen}
            onClose={state.close}
          >
            {content}
          </TooltipPopover>
        </OverlayContainer>
      )}
    </>
  );
}

export default Tooltip;

export function TooltipText(props: TooltipProps) {
  const { children, ...tooltipProps } = props;
  return (
    <Tooltip {...tooltipProps}>
      <div className={styles.label}>{children}</div>
    </Tooltip>
  );
}
