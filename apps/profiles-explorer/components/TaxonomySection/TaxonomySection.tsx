import * as React from 'react';

import styles from './TaxonomySection.module.css';

import { BreadcrumbItemProps } from '@wprdc-types/breadcrumbs';
import { Domain, TopicBrief } from '@wprdc-types/profiles';

import { BreadcrumbItem, Breadcrumbs } from '@wprdc-components/breadcrumbs';

import { TopicView } from '@wprdc-widgets/topic-view';

import DomainSection from './DomainSection';
import { useDomain, useSubdomain, useTopic } from '@wprdc-connections/profiles';
import { NavTabs } from './NavTabs';
import { TaxonomySectionProps } from './types';

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({
  taxonomy,
  geog,
  onExploreTopic,
  onCompareIndicator,
  currentDomainSlug,
  currentDomainHref,
  currentSubdomainSlug,
  currentSubdomainHref,
  currentTopicSlug,
  currentTopicHref,
  breadcrumbLinkComponent,
  basePath,
}: TaxonomySectionProps) => {
  function handleExploreTopic(topic: TopicBrief) {
    if (!!onExploreTopic) onExploreTopic(topic);
  }

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { data: currentDomain } = useDomain(currentDomainSlug);
  const { data: currentSubdomain } = useSubdomain(currentSubdomainSlug);
  const { data: currentTopic } = useTopic(currentTopicSlug);

  let breadcrumbs: BreadcrumbItemProps[] = [
    {
      key: 'taxonomy',
      children: taxonomy.name,
      href: '/explore',
    },
  ];
  if (currentDomain)
    breadcrumbs.push({
      key: 'domain',
      href:
        currentDomainHref ||
        `${basePath}/${currentDomainSlug}?geog=${geog?.slug}`,
      children: currentDomain.name,
      LinkComponent: breadcrumbLinkComponent,
      shallow: true,
    });
  if (currentSubdomain)
    breadcrumbs.push({
      key: 'subdomain',
      href:
        currentSubdomainHref ||
        `/explore/${currentDomainSlug}/${currentSubdomainSlug}?geog=${geog?.slug}`,
      children: currentSubdomain.name,
      LinkComponent: breadcrumbLinkComponent,
      shallow: true,
    });
  if (currentTopic)
    breadcrumbs.push({
      key: 'topic',
      href:
        currentTopicHref ||
        `${basePath}/${currentDomainSlug}/${currentTopicSlug}?geog=${geog?.slug}`,
      children: currentTopic.name,
      LinkComponent: breadcrumbLinkComponent,
      shallow: true,
    });

  // handle auto scrolling
  // 1. subdomain selection - scroll to subdomain title
  // 2. topic and domain selection - scroll to top
  React.useEffect(() => {
    if (!!currentTopicSlug) {
      if (!!scrollRef.current) scrollRef.current.scrollTop = 0;
    } else if (!!currentSubdomainSlug)
      document.getElementById(currentSubdomainSlug)?.scrollIntoView();
    else if (!!currentDomainSlug)
      if (!!scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentDomainSlug, currentSubdomainSlug, currentTopicSlug]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.nav}>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs>
            {breadcrumbs.map(breadcrumb => (
              <BreadcrumbItem key={breadcrumb.key} {...breadcrumb} />
            ))}
          </Breadcrumbs>
        </div>

        <NavTabs<Domain>
          items={taxonomy.domains}
          selectedKey={currentDomainSlug}
          geog={geog}
          basePath={basePath}
        />
      </div>

      <div className={styles.content} ref={scrollRef}>
        {!!currentTopic && (
          <TopicView
            onCompareIndicator={onCompareIndicator}
            topic={currentTopic}
            geog={geog}
          />
        )}
        {!currentTopic && (
          <div>
            <DomainSection
              domain={currentDomain}
              geog={geog}
              onExploreTopic={handleExploreTopic}
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
