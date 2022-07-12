import * as React from 'react';

import styles from '../TopicView.module.css';
import { TopicDetailViewProps } from '@wprdc-types/topic-view';
import classnames from 'classnames';
import { GeographyPicker } from '@wprdc-widgets/geography-picker';

import { ConnectedViz } from '@wprdc-widgets/viz';
import { parseAndSanitize } from '../util';
import { IndicatorBaseWithOptions } from '@wprdc-types/profiles';

import {
  RiBarChartFill,
  RiInformationLine,
  RiFlashlightLine,
} from 'react-icons/ri';

export const TopicViewDetail: React.FC<TopicDetailViewProps> = props => {
  const { topic, showGeog, geog, onGeogSelection, onCompareIndicator } = props;

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

  const { blurbs, vizes: vizIndicators } = indicators.reduce(
    (acc, cur) => {
      if (cur.options.isSingleValue) {
        return {
          blurbs: [...acc.blurbs, cur],
          vizes: [...acc.vizes, cur],
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
            <h2 className={styles.bigTitle}>{name}</h2>
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
        </div>
        <p className={styles.description}>{description}</p>

        {!!importance && (
          <div className={styles.callout}>
            <p className={styles.title}>Why this data is useful</p>
            <p className={styles.importance}>{importance}</p>
          </div>
        )}
      </div>

      {/* Quick facts */}
      {!!blurbs && !!blurbs.length && (
        <div className={styles.blurbs}>
          <h3 className={styles.subtitle}>
            <RiFlashlightLine /> Quick Stats
          </h3>
          <ul className={styles.blurbList}>
            {blurbs.map(blurb => (
              <li className={styles.blurbListItem} key={blurb.slug}>
                <ConnectedViz
                  mini
                  indicatorSlug={blurb.slug}
                  geog={geog}
                  onCompare={onCompareIndicator}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Vizes */}
      {!!vizIndicators && !!vizIndicators.length && (
        <div className={styles.vizes}>
          <h3 className={styles.subtitle}>
            <RiBarChartFill /> Indicators
          </h3>
          <div className={styles.vizList}>
            {vizIndicators.sort(sortVizes).map(indicator => {
              return (
                <div className={styles.vizListItem} key={indicator.slug}>
                  <ConnectedViz
                    indicatorSlug={indicator.slug}
                    geog={geog}
                    acrossGeogs={indicator.options.isMappable}
                    onCompare={onCompareIndicator}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* More Context*/}
      <div className={classnames(styles.detailSection)}>
        <h3 className={styles.subtitle}>
          <RiInformationLine /> Details
        </h3>

        {(!!fullDescription || !!longDescription) && (
          <div className={styles.details}>
            <h3 className={styles.title}>Description</h3>
            <div
              className={styles.detailsItem}
              dangerouslySetInnerHTML={parseAndSanitize(
                (fullDescription || longDescription) as string
              )}
            />
          </div>
        )}
        {limitations && (
          <div className={styles.details}>
            <h3 className={styles.title}>Limitations</h3>
            <div
              className={styles.detailsItem}
              dangerouslySetInnerHTML={parseAndSanitize(limitations)}
            />
          </div>
        )}
        {provenance && (
          <div className={styles.details}>
            <h3 className={styles.title}>Provenance</h3>
            <div
              className={styles.detailsItem}
              dangerouslySetInnerHTML={parseAndSanitize(provenance)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

function sortVizes(a: IndicatorBaseWithOptions, b: IndicatorBaseWithOptions) {
  return (
    (a.options.isSingleValue === true ? 1 : 0) -
    (b.options.isSingleValue === true ? 1 : 0)
  );
}
