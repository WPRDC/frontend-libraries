import * as React from 'react';

import styles from '../TopicView.module.css';
import { TopicDetailViewProps } from '@wprdc-types/topic-view';
import classnames from 'classnames';
import { GeographyPicker } from '@wprdc-widgets/geography-picker';
import { Button } from '@wprdc-components/button';
import { ConnectedViz } from '@wprdc-widgets/viz';
import { parseAndSanitize } from '../util';
import { IndicatorBaseWithOptions } from '@wprdc-types/profiles';

export const TopicViewDetail: React.FC<TopicDetailViewProps> = props => {
  const { topic, showGeog, geog, onGeogSelection, onCompareTopic } = props;

  const {
    name,
    description,
    indicators = [],
    longDescription,
    fullDescription,
    importance,
    limitations,
    provenance,
  } = topic || {};

  if (!topic || !geog) return null;

  const { blurbs, vizes } = indicators.reduce(
    (acc, cur) => {
      if (cur.options.isSingleValue) {
        return {
          blurbs: [...acc.blurbs, cur],
          vizes: acc.vizes,
        };
      } else {
        return {
          blurbs: acc.blurbs,
          vizes: [...acc.vizes, cur],
        };
      }
    },
    {
      blurbs: [] as IndicatorBaseWithOptions[],
      vizes: [] as IndicatorBaseWithOptions[],
    }
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
            {/* Options */}
          </div>
          {!!onCompareTopic && (
            <div className={styles.menuSection}>
              <Button onPress={() => onCompareTopic(topic)}>
                ⚖️ {'  '}Compare
              </Button>
            </div>
          )}
        </div>
        <p className={styles.description}>{description}</p>

        {!!importance && (
          <div>
            <p className={styles.importance}>{importance}</p>
          </div>
        )}
      </div>

      {/* Quick facts */}
      {!!blurbs && !!blurbs.length && (
        <div className={styles.blurbs}>
          <h2 className={styles.subtitle}>Quick Facts</h2>
          <ul className={styles.blurbList}>
            {blurbs.map(blurb => (
              <li className={styles.blurbListItem}>
                <ConnectedViz mini indicatorSlug={blurb.slug} geog={geog} />
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
            {vizes.map(viz => (
              <li className={styles.vizListItem}>
                <ConnectedViz indicatorSlug={viz.slug} geog={geog} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* More Context*/}
      <div className={classnames(styles.details)}>
        {(!!fullDescription || !!longDescription) && (
          <>
            <h2 className={styles.detailsSectionHeader}>Description</h2>
            <div
              className={styles.detailsItem}
              dangerouslySetInnerHTML={parseAndSanitize(
                (fullDescription || longDescription) as string
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
