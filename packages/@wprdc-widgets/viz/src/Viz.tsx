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

import { ChartRecord, DataVizCommonProps, VizWidgetProps } from '@wprdc-types/viz';

import { BigValue } from '@wprdc-viz/simple';
import { DataMap } from '@wprdc-viz/map';
import { BarChart, GeogHistogram, LineChart } from '@wprdc-viz/vega';
import { FlatTable } from '@wprdc-viz/table';

import { RiBracesFill, RiCodeSSlashFill, RiEditFill, RiFileCopyFill, RiShareFill } from 'react-icons/ri';
import { MdCompare } from 'react-icons/md';
import { Tooltip } from '@wprdc-components/tooltip';
import { EditMenu } from './menus/edit';
import { Button } from '@wprdc-components/button';

export const Viz: React.FC<VizWidgetProps> = ({
                                                indicator,
                                                mini = false,
                                                // coplanar = false,  // todo: look into other display formats
                                                inPreview,
                                                onCompare,
                                              }: VizWidgetProps) => {
  const [selectedTimeParts, setSelectedTimeParts] = React.useState<string[]>(
    indicator.timeAxis.timeParts.map(t => t.slug),
  );
  const [selectedVariables, setSelectedVariables] = React.useState<string[]>(
    indicator.variables.map(v => v.slug),
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

  function handleCompare() {
    if (!!onCompare) onCompare(indicator);
  }

  function handleCopy(str: string) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(str);
  }

  let chartHeight = 30 + indicator.variables.length * 45;
  if (chartHeight < 200) chartHeight = 200;

  const embedString = `<iframe src='https://profiles.wprdc.org/indicator/${indicator.slug}?geog=${indicator.geogs[0].slug}' />`;
  const apiString = `https://api.profiles.wprdc.org/indicator/${indicator.slug}?geog=${indicator.geogs[0].slug}`;

  const vizProps: DataVizCommonProps = React.useMemo(
    () => ({
      indicator,
      inPreview,
      selectedVariables,
      selectedTimeParts,
    }),
    [indicator.slug, inPreview, selectedVariables, selectedTimeParts],
  );

  const useLineChart = indicator.timeAxis.timeParts.length > 2;

  const Chart = useLineChart ? LineChart : BarChart;

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
          <Chart {...vizProps} />
        </div>
      );
    } else {
      // anything left should be chartable
      vizContent = (
        <div
          className={
            useLineChart ? styles.lineChartWithTable : styles.chartWithTable
          }
        >
          <div className={styles.chart} style={{ height: chartHeight }}>
            <Chart {...vizProps} />
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
            {!!onCompare && (
              <Button dense onPress={handleCompare}>
                <MdCompare /> Compare
              </Button>
            )}
            <Tooltip
              button
              title='Edit'
              content={
                <div className={styles.editMenu}>
                  <EditMenu
                    indicator={indicator}
                    selectedTimeParts={selectedTimeParts}
                    selectedVariables={selectedVariables}
                    onTimePartChange={handleTimeChange}
                    onVariableChange={handleVariableChange}
                  />
                </div>
              }
            >
              <div>
                <RiEditFill /> Edit
              </div>
            </Tooltip>
            <Tooltip
              button
              title='Share'
              content={
                <div className={styles.shareMenu}>
                  <ul>
                    <li>
                      <span>
                        <RiBracesFill />
                      </span>{' '}
                      <a
                        href={apiString}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        API
                      </a>
                    </li>
                    <li>
                      <p className={styles.bolded}>
                        <span>
                          <RiCodeSSlashFill />
                        </span>{' '}
                        Embed
                        <span
                          onClick={() => handleCopy(embedString)}
                          className={styles.clickable}
                        >
                          <RiFileCopyFill />
                        </span>
                      </p>
                      <textarea>{embedString}</textarea>
                    </li>
                  </ul>
                </div>
              }
            >
              <div>
                <RiShareFill /> Share
              </div>
            </Tooltip>
          </div>
        </div>
      )}
      {vizContent}
    </div>
  );
};
