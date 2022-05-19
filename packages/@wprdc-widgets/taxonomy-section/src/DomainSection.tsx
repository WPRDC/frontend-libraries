import * as React from 'react';

import styles from './DomainSection.module.css';
import SubdomainSection from './SubdomainSection';
import { Domain } from '@wprdc-types/profiles';
import { SectionSharedProps } from '@wprdc-types/taxonomy-section';

interface Props extends SectionSharedProps {
  domain: Domain;
}

export default function DomainSection({
  domain,
  geog,
  onExploreDataViz,
  onExploreIndicator,
}: Props) {
  return (
    <div id={domain.slug} className={styles.wrapper}>
      <div className={styles.description}>{domain.description}</div>
      {domain.subdomains.map((subdomain) => (
        <SubdomainSection
          key={subdomain.slug}
          subdomain={subdomain}
          geog={geog}
          onExploreDataViz={onExploreDataViz}
          onExploreIndicator={onExploreIndicator}
        />
      ))}
    </div>
  );
}
