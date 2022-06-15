import * as React from 'react';

import styles from './TaxonomySection.module.css';

import { BreadcrumbItemProps } from '@wprdc-types/breadcrumbs';
import { TaxonomySectionProps } from '@wprdc-types/taxonomy-section';
import { Domain, IndicatorBase, Topic } from '@wprdc-types/profiles';

import { Breadcrumbs, BreadcrumbItem } from '@wprdc-components/breadcrumbs';

import { TopicView } from '@wprdc-widgets/topic-view';

import DomainSection from './DomainSection';
import { useDomain } from '@wprdc-connections/profiles';
import { NavTabs } from './NavTabs';

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({
  taxonomy,
  geog,
  onExploreTopic,
  onExploreIndicator,
  onCompareTopic,
  currentDomainSlug,
  currentDomainHref,
  currentTopicSlug,
  currentTopicHref,
  currentIndicatorSlug,
  currentIndicatorHref,
  breadcrumbLinkComponent,
}: TaxonomySectionProps) => {
  function handleExploreTopic(topic: Topic) {
    if (!!onExploreTopic) onExploreTopic(topic);
  }

  function handleExploreIndicator(indicator: IndicatorBase) {
    if (!!onExploreIndicator) onExploreIndicator(indicator);
  }

  const topicFetchController = new AbortController();

  // fixme: this is where my lag is at!!!!
  //  there's a few second delay where currentDomainSlug and currentDomain.slug don't match
  //  this makes me think that the fetch happening in useDomain is being held up
  const { domain: currentDomain } = useDomain(currentDomainSlug);

  const currentTopic = React.useMemo(
    () =>
      !!currentDomain &&
      currentDomain.topics.find(t => t.slug === currentTopicSlug),
    [currentDomainSlug, currentTopicSlug],
  );

  const currentIndicator = React.useMemo(
    () =>
      currentTopic &&
      currentTopic.indicators.find(dv => dv.slug === currentIndicatorSlug),
    [currentDomainSlug, currentTopicSlug, currentIndicatorSlug],
  );

  let breadcrumbs: BreadcrumbItemProps[] = [];
  if (currentDomain)
    breadcrumbs.push({
      key: 'domain',
      href:
        currentDomainHref || `/explore/${currentDomainSlug}?geog=${geog?.slug}`,
      children: currentDomain.name,
      LinkComponent: breadcrumbLinkComponent,
    });

  if (currentTopic)
    breadcrumbs.push({
      key: 'topic',
      href:
        currentTopicHref ||
        `/explore/${currentDomainSlug}/${currentTopicSlug}?geog=${geog?.slug}`,
      children: currentTopic.name,
      LinkComponent: breadcrumbLinkComponent,
    });
  if (currentIndicator)
    breadcrumbs.push({
      key: 'indicator',
      href:
        currentIndicatorHref ||
        `/explore/${currentDomainSlug}/${currentTopicSlug}/${currentIndicatorSlug}?geog=${geog?.slug}`,
      children: currentIndicator.name,
      LinkComponent: breadcrumbLinkComponent,
    });

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs showCurrent={false}>
        {breadcrumbs.map(breadcrumb => (
          <BreadcrumbItem key={breadcrumb.id} {...breadcrumb} />
        ))}
      </Breadcrumbs>
      <div className={styles.content}>
        {!currentIndicator && !!currentTopic && (
          <TopicView
            onCompareTopic={onCompareTopic}
            topic={currentTopic}
            geog={geog}
            onExploreIndicator={onExploreIndicator}
          />
        )}
        {!currentIndicator && !currentTopic && (
          <NavTabs<Domain>
            items={taxonomy.domains}
            selectedKey={currentDomainSlug}
            geog={geog}
          />
        )}
        <DomainSection
          domain={currentDomain}
          geog={geog}
          onExploreIndicator={handleExploreIndicator}
          onExploreTopic={handleExploreTopic}
          topicFetchController={topicFetchController}
        />
      </div>
    </div>
  );
};

interface LinkProps {
  item: Domain;
}
