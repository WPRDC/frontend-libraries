/**
 *
 * DataVizCard
 *
 */
import React, { useMemo } from 'react';

import '../main.css';
import styles from './DataVizCard.module.css';

import Measure from 'react-measure';
import {
  RiBarChart2Fill,
  RiMapFill,
  RiNumbersFill,
  RiTableFill,
} from 'react-icons/ri';

import { DataVizCardProps } from '@wprdc-types/data-viz';
import { DataVizType } from '@wprdc-types/shared';

import { SourceList } from '@wprdc-components/source-list';
import { Button } from '@wprdc-components/button';

import { Message } from '../message';
import { DataVizCardSkeleton } from './DataVizCardSkeleton';

export function DataVizCard(props: DataVizCardProps) {
  const {
    dataViz,
    geog,
    showGeog,
    colorScheme,
    Visualization,
    isLoading,
    // menu,
    onExplore,
    error,
    headingLevel,
  } = props;
  const { name, description, vizType } = dataViz || {};
  /* Keep track fo dimensions to send to vega charts */
  const [{ width, height }, setDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  const Heading: keyof JSX.IntrinsicElements = headingLevel
    ? (`h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
    : 'div';

  function handleExplore() {
    if (!!onExplore && !!dataViz) onExplore(dataViz);
  }

  /* subheadings */
  let subheadingLevel: typeof headingLevel = undefined;
  if (headingLevel && headingLevel < 6)
    subheadingLevel = (headingLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6;

  const Icon = React.useMemo(() => {
    switch (vizType) {
      case DataVizType.Table:
        return RiTableFill;
      case DataVizType.BarChart:
      case DataVizType.LineChart:
      case DataVizType.PieChart:
      case DataVizType.PyramidChart:
      case DataVizType.ScatterPlot:
      case DataVizType.Histogram:
        return RiBarChart2Fill;
      case DataVizType.MiniMap:
        return RiMapFill;
      case DataVizType.BigValue:
      case DataVizType.Sentence:
      default:
        return RiNumbersFill;
    }
  }, [vizType]);

  const geogTitle: string | undefined = useMemo(() => {
    if (showGeog && !!geog) {
      return ` in ${geog.title}`;
    }
    return undefined;
  }, [geog, showGeog]);

  if (isLoading) {
    return <DataVizCardSkeleton />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.typeLabel}>
          <Icon className={styles.typeIcon} />
          <span>{vizType}</span>
        </div>
        <Heading className={styles.title}>
          {name}
          {geogTitle}
        </Heading>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.dataViz}>
        <Measure
          bounds
          onResize={contentRect => {
            if (contentRect.bounds) setDimensions(contentRect.bounds);
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef}>
              <div
                aria-label="data presentation preview"
                className={styles.vizPane}
              >
                {!!error && <Message error={error.message} />}
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
      </div>
      <div className={styles.menuSection}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.sources}>
              {!!dataViz && !!dataViz.sources && (
                <SourceList
                  headingLevel={subheadingLevel}
                  sources={dataViz.sources}
                />
              )}
            </div>
          </div>
          <div>
            <Button onPress={handleExplore}>Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
