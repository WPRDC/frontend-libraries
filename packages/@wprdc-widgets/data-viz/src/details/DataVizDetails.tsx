/**
 *
 * DataVizDetails
 *
 */
import React from 'react';
import classnames from 'classnames';

import styles from './DataVizDetails.module.css';

import Measure from 'react-measure';
import { SourceList } from '@wprdc-components/source-list';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { DataVizDetailsProps } from '@wprdc-types/data-viz';
import { Heading } from '@wprdc-components/heading';
import { DataVizType } from '@wprdc-types/shared';

import { Message } from '../message';
import { isVega } from '../util';

export function DataVizDetails(props: DataVizDetailsProps) {
  const {
    dataViz,
    geog,
    colorScheme,
    Visualization,
    isLoading,
    error,
    headingLevel = 3,
  } = props;
  const { name, description } = dataViz || {};
  /* Keep track fo dimensions to send to vega charts */
  const [{ width, height }, setDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.topSection}>
        <Heading level={headingLevel} className={styles.title}>
          {name}
        </Heading>
        <p className={styles.description}>{description}</p>
      </div>
      <Measure
        bounds
        onResize={(contentRect) => {
          if (contentRect.bounds) setDimensions(contentRect.bounds);
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef}>
            <div
              className={classnames(styles.vizWrapper, {
                [styles.chartWrapper]: isVega(dataViz?.vizType),
                [styles.mapWrapper]: dataViz?.vizType === DataVizType.MiniMap,
              })}
              aria-label="data presentation"
            >
              {!!error && <Message error={error.message} />}
              {isLoading && <LoadingMessage name={dataViz && dataViz.name} />}
              {!isLoading && !!Visualization && !!dataViz && !!geog && (
                <Visualization
                  dataViz={dataViz}
                  geog={geog}
                  colorScheme={colorScheme}
                  vizHeight={height - 15}
                  vizWidth={width - 15}
                />
              )}
            </div>
          </div>
        )}
      </Measure>
      <div className={styles.sourcesSection}>
        {!!dataViz && !!dataViz.sources && (
          <SourceList sources={dataViz.sources} />
        )}
      </div>
    </div>
  );
}
