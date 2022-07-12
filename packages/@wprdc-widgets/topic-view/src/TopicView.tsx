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

export const TopicView: React.FC<TopicViewProps> = ({
  topic: topicBrief,
  geog,
  card,
  onExploreTopic,
  onCompareIndicator,
}) => {
  const topicSlug = topicBrief ? topicBrief.slug : '';
  const { data: topic, isLoading, error } = useTopic(topicSlug);

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
        onExploreTopic={onExploreTopic}
        onCompareIndicator={onCompareIndicator}
      />
    );
  }
  return (
    <TopicViewDetail
      topic={topic}
      geog={geog}
      isLoading={isLoading}
      onCompareIndicator={onCompareIndicator}
    />
  );
};

export default TopicView;
