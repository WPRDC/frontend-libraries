import * as React from 'react';

import styles from './TaxonomySection.module.css';

import { BreadcrumbItemProps } from '@wprdc-types/breadcrumbs';
import { Domain, TopicBrief } from '@wprdc-types/profiles';

import { Breadcrumbs, BreadcrumbItem } from '@wprdc-components/breadcrumbs';

import { TopicView } from '@wprdc-widgets/topic-view';

import DomainSection from './DomainSection';
import { useDomain } from '@wprdc-connections/profiles';
import { NavTabs } from './NavTabs';
import { TaxonomySectionProps } from './types';

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({
  taxonomy,
  geog,
  onExploreTopic,
  onCompareIndicator,
  currentDomainSlug,
  currentDomainHref,
  currentTopicSlug,
  currentTopicHref,
  breadcrumbLinkComponent,
  basePath,
}: TaxonomySectionProps) => {
  function handleExploreTopic(topic: TopicBrief) {
    if (!!onExploreTopic) onExploreTopic(topic);
  }

  const topicFetchController = new AbortController();

  const { data: currentDomain } = useDomain(currentDomainSlug);

  const currentTopic = React.useMemo(
    () =>
      !!currentDomain &&
      currentDomain.topics.find(t => t.slug === currentTopicSlug),
    [currentDomainSlug, currentTopicSlug],
  );

  let breadcrumbs: BreadcrumbItemProps[] = [];
  if (currentDomain)
    breadcrumbs.push({
      key: 'domain',
      href:
        currentDomainHref ||
        `${basePath}/${currentDomainSlug}?geog=${geog?.slug}`,
      children: currentDomain.name,
      LinkComponent: breadcrumbLinkComponent,
    });

  if (currentTopic)
    breadcrumbs.push({
      key: 'topic',
      href:
        currentTopicHref ||
        `${basePath}/${currentDomainSlug}/${currentTopicSlug}?geog=${geog?.slug}`,
      children: currentTopic.name,
      LinkComponent: breadcrumbLinkComponent,
    });

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs showCurrent={false}>
        {breadcrumbs.map(breadcrumb => (
          <BreadcrumbItem key={breadcrumb.key} {...breadcrumb} />
        ))}
      </Breadcrumbs>
      <div className={styles.content}>
        {!!currentTopic && (
          <TopicView
            onCompareIndicator={onCompareIndicator}
            topic={currentTopic}
            geog={geog}
          />
        )}
        {!currentTopic && (
          <div>
            <NavTabs<Domain>
              items={taxonomy.domains}
              selectedKey={currentDomainSlug}
              geog={geog}
              basePath={basePath}
            />
            <DomainSection
              domain={currentDomain}
              geog={geog}
              onExploreTopic={handleExploreTopic}
              topicFetchController={topicFetchController}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface LinkProps {
  item: Domain;
}
