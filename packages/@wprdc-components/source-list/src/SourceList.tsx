/**
 *
 * SourceList
 *
 */
import React from 'react';

import './main.css';
import styles from './SourceList.module.css';

import { SourceBase } from '@wprdc-types/viz';

import { TooltipText } from '@wprdc-components/tooltip';

interface Props {
  sources: SourceBase[];
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function SourceList(props: Props) {
  const { sources, headingLevel } = props;

  const Label: keyof JSX.IntrinsicElements = headingLevel
    ? (`h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
    : 'div';

  return (
    <div className={styles.container}>
      <Label className={styles.title}>Sources</Label>
      <ul className={styles.list}>
        {sources.map(source => (
          <li key={source.slug} className={styles.listItem}>
            <TooltipText
              title={source.name}
              content={
                <div className={styles.popover}>
                  <a href={source.infoLink}>{source.infoLink}</a>
                  <p>{source.description}</p>
                </div>
              }
            >
              {source.name}
            </TooltipText>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SourceList;
