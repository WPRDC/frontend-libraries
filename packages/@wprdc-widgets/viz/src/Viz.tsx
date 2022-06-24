/**
 *
 * Viz
 *
 * Visualizes data
 *
 */
import * as React from 'react';
import './main.css';
import styles from './Viz.module.css';

import { VizWidgetProps } from '@wprdc-types/viz';
import { BigValue } from '@wprdc-viz/simple';
import { DataMap } from '@wprdc-viz/map';
import { BarChart, GeogHistogram } from '@wprdc-viz/vega';
import { FlatTable } from '@wprdc-viz/table';

export const Viz: React.FC<VizWidgetProps> = ({
  indicator,
  mini = false,
  // coplanar = false,
  inPreview,
}: VizWidgetProps) => {
  let vizContent: React.ReactNode;
  // if variant is mini, only provide a `Value` viz
  if (mini || (indicator.options.isSingleValue && inPreview)) {
    vizContent = <BigValue indicator={indicator} inPreview={inPreview} />;
  }
  // otherwise, if single var and single time, show map with cross-geog chart
  else if (indicator.options.isMappable) {
    vizContent = (
      <div className={styles.mapWithChart}>
        <div>
          <DataMap indicator={indicator} />
        </div>
        <div>
          <GeogHistogram indicator={indicator} />
        </div>
      </div>
    );
  } else {
    if (!!inPreview) {
      vizContent = (
        <div className={styles.inPreview}>
          <BarChart inPreview={inPreview} indicator={indicator} />
        </div>
      );
    } else {
      // anything left should be chartable
      vizContent = (
        <div className={styles.chartWithTable}>
          <div className={styles.chart}>
            <BarChart inPreview={inPreview} indicator={indicator} />
          </div>
          <div className={styles.table}>
            <FlatTable indicator={indicator} />
          </div>
        </div>
      );
    }
  }

  // if multiple variables, show chart/table
  return <div className={styles.wrapper}>{vizContent}</div>;
};
