/**
 *
 * LoadingMessage
 *
 */
import React from 'react';

import './main.css';
import styles from './LoadingMessage.module.css';

import { LoadingMessageProps } from '@wprdc-types/loading-message';
import { Spinner } from '@wprdc-components/spinner';

export const LoadingMessage: React.FC<LoadingMessageProps> = ({
                                                                name,
                                                                message,
                                                              }) => {
  const displayName = !!name ? ` ${name}` : '';
  const msg = message || `Loading ${displayName}...`;
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.spinnerDiv}>
          <Spinner />
        </div>
        <div className={styles.message}>{msg}</div>
      </div>
    </div>
  );
};

export default LoadingMessage;
