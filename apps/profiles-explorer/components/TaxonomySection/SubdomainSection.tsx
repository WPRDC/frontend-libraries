import * as React from 'react';

import styles from './SubdomainSection.module.css';

import { SectionSharedProps } from './types';
import TopicSection from './TopicSection';
import { Resource } from '@wprdc-types/shared';
import { useSubdomain } from '@wprdc-connections/profiles';

interface Props extends SectionSharedProps {
  subdomain: Resource;
}

export default function SubdomainSection({
  subdomain: { slug },
  geog,
  onExploreTopic,
}: Props) {
  const { data: subdomain } = useSubdomain(slug);
  if (subdomain) {
    return (
      <div id={subdomain.slug} className={styles.wrapper}>
        <h4 className={styles.title}>{subdomain.name}</h4>
        <div className={styles.description}>{subdomain.description}</div>
        <div className={styles.topics}>
          {subdomain.topics.map(topic => (
            <TopicSection
              key={topic.slug}
              topic={topic}
              geog={geog}
              onExploreTopic={onExploreTopic}
            />
          ))}
        </div>
      </div>
    );
  }
  return null;
}
