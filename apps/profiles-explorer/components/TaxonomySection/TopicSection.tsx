import * as React from 'react';
import { TopicBrief } from '@wprdc-types/profiles';
import { TopicView } from '@wprdc-widgets/topic-view';

import styles from './TopicSection.module.css';
import { SectionSharedProps } from './types';

interface Props extends SectionSharedProps {
  topic: TopicBrief;
}

export default function TopicSection({
  topic,
  geog,
  onExploreIndicator,
  onExploreTopic,
  topicFetchController,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <TopicView
        card
        geog={geog}
        topic={topic}
        onExploreIndicator={onExploreIndicator}
        onExploreTopic={onExploreTopic}
        abortController={topicFetchController}
      />
    </div>
  );
}
