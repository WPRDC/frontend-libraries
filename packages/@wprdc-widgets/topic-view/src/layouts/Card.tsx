import * as React from 'react';
import { TopicViewCardProps } from '@wprdc-types/topic-view';
import styles from '../TopicView.module.css';
import classnames from 'classnames';
import { IndicatorBase } from '@wprdc-types/profiles';
import { ConnectedViz } from '@wprdc-widgets/viz';
import { LoadingMessage } from '@wprdc-components/loading-message';

export const TopicViewCard: React.FC<TopicViewCardProps> = props => {
  const {
    topicBrief,
    topic,
    geog,
    onExploreTopic,
    headingLevel,
    isLoading,
  } = props;

  const { name, description, slug } = topic || topicBrief || {};

  const {
    indicators,
    // longDescription,
    // fullDescription,
    // importance,
    // limitations,
    // provenance,
    primaryIndicatorIDs,
  } = topic || {};

  const Heading: keyof JSX.IntrinsicElements = headingLevel
    ? (`h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
    : 'div';

  function handleClick() {
    if (!!onExploreTopic && !!topic) onExploreTopic(topic);
  }

  // make viz based on indicator
  // if time and variable dims are singletons, make a big value
  // otherwise make a chart

  // get primary indicator
  const primaryIndicator: IndicatorBase | undefined = React.useMemo(() => {
    if (!indicators || !indicators.length) {
      return undefined;
    } else if (indicators.length === 1) {
      return indicators[0];
    } else if (!!primaryIndicatorIDs && !!primaryIndicatorIDs.length) {
      return indicators.find(ind => ind.id === primaryIndicatorIDs[0]);
    } else {
      // find the best indicator (big val > colum chart > whatever)
      return (
        indicators.find(ind => ind.options.isSingleValue) ||
        indicators.find(ind => ind.options.useColumns) ||
        indicators[0]
      );
    }
  }, [slug]);

  if (!primaryIndicator || !geog) return null;

  console.log('INDICATOR', primaryIndicator.slug);

  return (
    <button
      className={styles.cardContainer}
      onClick={handleClick}
      aria-label={`Explore topic: ${name}`}
    >
      <div className={styles.vizPane}>
        {!!isLoading && <LoadingMessage />}
        {!isLoading && (
          <ConnectedViz
            inPreview
            indicatorSlug={primaryIndicator.slug}
            geog={geog}
          />
        )}
      </div>
      <div className={classnames(styles.details, styles.stretchy)}>
        <div>
          {!!name && (
            <div className={styles.titleBar}>
              <div className={styles.titleDiv}>
                <Heading className={styles.cardTitle}>{name}</Heading>
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
};
