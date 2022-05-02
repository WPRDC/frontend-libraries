/**
 *
 * Indicator
 *
 * A related collection of data vizes.
 *
 */
import * as React from 'react';

import classnames from 'classnames';

import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

import './main.css';
import styles from './IndicatorView.module.css';

import { IndicatorViewProps } from '@wprdc-types/indicator-view';
import { DataVizType } from '@wprdc-types/shared';
import { DataVizID } from '@wprdc-types/viz';
import { DataVizVariant } from '@wprdc-types/data-viz';

import { LoadingMessage } from '@wprdc-components/loading-message';
import { ConnectedDataViz } from '@wprdc-widgets/data-viz';

import { GeographyPicker } from '@wprdc-widgets/geography-picker';
import { Button } from '@wprdc-components/button';

export const IndicatorView: React.FC<IndicatorViewProps> = ({
  indicator,
  geog,
  onGeogSelection,
  card,
  onExploreDataViz,
  onExploreIndicator,
  onCompareIndicator,
  isLoading,
  showGeog,
}) => {
  if (!!isLoading) return <LoadingMessage />;
  if (!indicator) return <div />;

  const {
    name,
    description,
    dataVizes,
    longDescription,
    fullDescription,
    importance,
    limitations,
    provenance,
  } = indicator || {};

  // load first data viz (will eventually be some sort of master one or something)
  const primaryDataViz = !!dataVizes && dataVizes[0];

  const { blurbs, vizes } = dataVizes.reduce<
    Record<'blurbs' | 'vizes', DataVizID[]>
  >(
    (record, viz) => {
      if (viz.vizType === DataVizType.BigValue) {
        return { blurbs: [...record.blurbs, viz], vizes: record.vizes };
      }
      return { blurbs: record.blurbs, vizes: [...record.vizes, viz] };
    },
    { blurbs: [], vizes: [] }
  );

  function parseAndSanitize(content: string) {
    return {
      __html: sanitizeHtml(marked.parse(content)),
    };
  }

  function handleExploreIndicator() {
    if (!!onExploreIndicator && !!indicator) onExploreIndicator(indicator);
  }

  if (!!card)
    return (
      <button
        className={styles.cardContainer}
        onClick={handleExploreIndicator}
        aria-label={`Explore indicator: ${indicator.name}`}
      >
        <div className={styles.vizPane}>
          {card && primaryDataViz && (
            <ConnectedDataViz
              geog={geog}
              variant={DataVizVariant.Preview}
              key={primaryDataViz.slug}
              dataVizSlug={primaryDataViz.slug}
              onExplore={onExploreDataViz}
            />
          )}
        </div>
        <div className={classnames(styles.details, styles.stretchy)}>
          <div>
            {!!name && (
              <div className={styles.titleBar}>
                <div className={styles.titleDiv}>
                  <h5 className={styles.cardTitle}>{name}</h5>
                </div>
              </div>
            )}
          </div>
          <div className={styles.descriptionContainer}>
            <p className={styles.cardDescription}>{description}</p>
          </div>
        </div>
      </button>
    );

  return (
    <div className={classnames(styles.pageContainer)}>
      <div className={classnames(styles.titleSection)}>
        <div className={styles.titleBar}>
          <div className={styles.titleDiv}>
            <h1 className={styles.bigTitle}>{name}</h1>
            {!!showGeog && (
              <p className={styles.geogPicker}>
                for
                <GeographyPicker
                  selectedGeog={geog}
                  onSelection={onGeogSelection}
                />
              </p>
            )}
          </div>
        </div>
        <p className={styles.detailsItem}>{description}</p>

        {!!importance && (
          <div>
            <p className={styles.importance}>{importance}</p>
          </div>
        )}
      </div>

      {/* Options */}
      {!!onCompareIndicator && (
        <div className={styles.menuSection}>
          <h2 className={styles.subtitle}>Actions</h2>
          <div className="w-20">
            <Button onPress={() => onCompareIndicator(indicator)}>
              ⚖️ Compare
            </Button>
          </div>
        </div>
      )}

      {/* Quick facts */}
      {!!blurbs && !!blurbs.length && (
        <div className={styles.blurbs}>
          <h2 className={styles.subtitle}>Quick Facts</h2>
          <ul className={styles.blurbList}>
            {blurbs.map((blurb) => (
              <li className={styles.blurbListItem}>
                <ConnectedDataViz
                  geog={geog}
                  variant={DataVizVariant.Blurb}
                  dataVizSlug={blurb.slug}
                  onExplore={onExploreDataViz}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Vizes */}
      {!!vizes && !!vizes.length && (
        <div className={styles.vizes}>
          <h2 className={styles.subtitle}>Tables and Visualizations</h2>
          <ul className={styles.vizList}>
            {vizes.map((viz) => (
              <li className={styles.vizListItem}>
                <ConnectedDataViz
                  geog={geog}
                  variant={DataVizVariant.Card}
                  dataVizSlug={viz.slug}
                  onExplore={onExploreDataViz}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* More Context*/}
      <div className={classnames(styles.details)}>
        {(fullDescription || longDescription) && (
          <>
            <h2 className={styles.detailsSectionHeader}>Description</h2>
            <div
              className={styles.detailsItem}
              dangerouslySetInnerHTML={parseAndSanitize(
                fullDescription || longDescription
              )}
            />
          </>
        )}
        {limitations && (
          <>
            <h2 className={styles.detailsSectionHeader}>Limitations</h2>
            <div
              className={styles.detailsItem}
              dangerouslySetInnerHTML={parseAndSanitize(limitations)}
            />
          </>
        )}
        {provenance && (
          <>
            <h2 className={styles.detailsSectionHeader}>Provenance</h2>
            <div
              className={styles.detailsItem}
              dangerouslySetInnerHTML={parseAndSanitize(provenance)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default IndicatorView;
