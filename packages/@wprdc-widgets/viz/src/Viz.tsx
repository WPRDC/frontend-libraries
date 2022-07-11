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

import classNames from 'classnames';

import {
  ChartRecord,
  DataVizCommonProps,
  VizWidgetProps,
} from '@wprdc-types/viz';

import { BigValue } from '@wprdc-viz/simple';
import { DataMap } from '@wprdc-viz/map';
import { BarChart, GeogHistogram } from '@wprdc-viz/vega';
import { FlatTable } from '@wprdc-viz/table';

import { RiEditFill, RiPrinterFill, RiShareFill } from 'react-icons/ri';
import { MdCompare } from 'react-icons/md';
import { Tooltip } from '@wprdc-components/tooltip';
import { EditMenu } from './menus/edit';

export const Viz: React.FC<VizWidgetProps> = ({
  indicator,
  mini = false,
  // coplanar = false,  // todo: look into other display formats
  inPreview,
}: VizWidgetProps) => {
  const [selectedTimeParts, setSelectedTimeParts] = React.useState<string[]>(
    indicator.timeAxis.timeParts.map(t => t.slug)
  );
  const [selectedVariables, setSelectedVariables] = React.useState<string[]>(
    indicator.variables.map(v => v.slug)
  );

  const [hoveredRecord, setHoveredRecord] = React.useState<ChartRecord>();

  function handleTimeChange(selection: string[]) {
    setSelectedTimeParts(selection);
  }

  function handleVariableChange(selection: string[]) {
    setSelectedVariables(selection);
  }

  function handleHover(datum: ChartRecord | {}) {
    if (!!Object.keys(datum).length) setHoveredRecord(datum as ChartRecord);
    else setHoveredRecord(undefined);
  }

  const chartHeight = 30 + indicator.variables.length * 45;

  const vizProps: DataVizCommonProps = React.useMemo(
    () => ({
      indicator,
      inPreview,
      selectedVariables,
      selectedTimeParts,
    }),
    [indicator.slug, inPreview, selectedVariables, selectedTimeParts]
  );

  let vizContent: React.ReactNode;
  // if variant is mini, only provide a `Value` viz
  if (mini || (indicator.options.isSingleValue && inPreview)) {
    vizContent = <BigValue indicator={indicator} inPreview={inPreview} />;
  }
  // otherwise, if single var and single time, show map with cross-geog chart
  else if (indicator.options.isMappable) {
    vizContent = (
      <div className={styles.mapWithChart}>
        <div className={styles.mapDiv}>
          <DataMap
            {...vizProps}
            onHover={handleHover}
            hoveredRecord={hoveredRecord}
          />
        </div>
        <div className={styles.chartDiv}>
          <GeogHistogram
            {...vizProps}
            onHover={handleHover}
            hoveredRecord={hoveredRecord}
          />
        </div>
      </div>
    );
  } else {
    if (!!inPreview) {
      vizContent = (
        <div className={styles.inPreview}>
          <BarChart {...vizProps} />
        </div>
      );
    } else {
      // anything left should be chartable
      vizContent = (
        <div className={styles.chartWithTable}>
          <div className={styles.chart} style={{ height: chartHeight }}>
            <BarChart {...vizProps} />
          </div>
          <div className={styles.table}>
            <FlatTable {...vizProps} />
          </div>
        </div>
      );
    }
  }

  // if multiple variables, show chart/table
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.inPreview]: !!inPreview,
      })}
    >
      {!mini && !inPreview && (
        <div className={styles.vizListHeading}>
          <div>
            <h3>{indicator.name}</h3>
          </div>
          <div>
            <Tooltip title="Compare" button content={'Compare'}>
              <div>
                <MdCompare /> Compare
              </div>
            </Tooltip>
            <Tooltip
              button
              title="Edit"
              content={
                <EditMenu
                  indicator={indicator}
                  selectedTimeParts={selectedTimeParts}
                  selectedVariables={selectedVariables}
                  onTimePartChange={handleTimeChange}
                  onVariableChange={handleVariableChange}
                />
              }
            >
              <div>
                <RiEditFill /> Edit
              </div>
            </Tooltip>
            <Tooltip button title="Edit" content={'woot'}>
              <div>
                <RiShareFill /> Share
              </div>
            </Tooltip>
            <Tooltip button title="Edit" content={'woot'}>
              <div>
                <RiPrinterFill /> Print
              </div>
            </Tooltip>
          </div>
        </div>
      )}
      {vizContent}
    </div>
  );
};
