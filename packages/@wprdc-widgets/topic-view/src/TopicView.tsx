/**
 *
 * Topic
 *
 * A related collection of data vizes.
 *
 */
import * as React from 'react';

import './main.css';

import { TopicViewProps } from '@wprdc-types/topic-view';

import { TopicViewCard } from './layouts/Card';
import { TopicViewDetail } from './layouts/Detail';
import { useTopic } from '@wprdc-connections/profiles';
import { ErrorMessage } from '@wprdc-components/error-message';
// import { TopicViewDetail } from './layouts/Detail';

export const TopicView: React.FC<TopicViewProps> = ({
  topic: topicBrief,
  geog,
  // onGeogSelection,
  card,
  // onExploreTopic,
  // onExploreIndicator,
  // onCompareTopic,
  // showGeog,
  // headingLevel,
}) => {
  const topicSlug = topicBrief ? topicBrief.slug : '';
  const { topic, isLoading, error } = useTopic(topicSlug);
  if (!!error) {
    console.error(error);
    return (
      <ErrorMessage title={'Error'} message={'error'} variant="centered" />
    );
  }
  if (!topic) return <div />;

  if (!!card) {
    return (
      <TopicViewCard
        topicBrief={topicBrief}
        topic={topic}
        geog={geog}
        isLoading={isLoading}
      />
    );
  }
  return <TopicViewDetail topic={topic} geog={geog} isLoading={isLoading} />;
};

export default TopicView;
