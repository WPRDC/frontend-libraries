/**
 *
 * ErrorMessage
 *
 * [ Shows errors ]
 *
 */
import * as React from 'react';
import './main.css';
import styles from './ErrorMessage.module.css';

import { ErrorMessageProps } from '@wprdc-types/error-message';

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Uncaught Error',
  message = 'Please contact the helpdesk.',
  variant,
}) => {
  if (variant === 'centered')
    return (
      <div className={styles.centeredContainer}>
        <p className={styles.centeredTitle}>{title}</p>
        <p className={styles.centeredMessage}>{message}</p>
      </div>
    );
  return (
    <div className={styles.inlineContainer}>
      <div className={styles.inlineTitle}>{title}</div>{' '}
      <div className={styles.inlineMessage}>{message}</div>
    </div>
  );
};

ErrorMessage.propTypes = {};

export default ErrorMessage;
