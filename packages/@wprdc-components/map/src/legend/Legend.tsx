/**
 *
 * Legend
 *
 */
import * as React from 'react';
import '../main.css';

import { ConnectedLegendProps } from '@wprdc-types/connections';

import styles from './Legend.module.css';

export const Legend: React.FC<ConnectedLegendProps> = ({
  title,
  toolboxes,
  children,
}) => {
  console.log(toolboxes);
  return (
    <div className={styles.container}>
      {!!title && <div className={styles.title}>{title}</div>}
      {!!toolboxes && toolboxes.map(tb => tb.legendSection)}
      {children}
    </div>
  );
};

Legend.defaultProps = {
  title: 'Legend',
};
