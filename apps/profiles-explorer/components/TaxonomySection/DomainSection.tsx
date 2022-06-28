import * as React from 'react';

import styles from './DomainSection.module.css';
import { Domain } from '@wprdc-types/profiles';
import TopicSection from './TopicSection';
import { SectionSharedProps } from './types';

interface Props extends SectionSharedProps {
  domain?: Domain;
}

export default function DomainSection({
  domain,
  geog,
  onExploreTopic,
  topicFetchController,
}: Props) {
  const topics = React.useMemo(() => domain?.topics, [domain?.slug]);
  if (!domain || !topics) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.description}>{domain.description}</div>
      <div className={styles.topics}>
        {topics.map(topic => (
          <TopicSection
            key={topic.slug}
            topic={topic}
            geog={geog}
            onExploreTopic={onExploreTopic}
            topicFetchController={topicFetchController}
          />
        ))}
      </div>
    </div>
  );
}
