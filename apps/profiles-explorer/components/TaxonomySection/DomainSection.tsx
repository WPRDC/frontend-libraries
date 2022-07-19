import * as React from 'react';

import styles from './DomainSection.module.css';
import { Domain } from '@wprdc-types/profiles';

import { SectionSharedProps } from './types';
import SubdomainSection from './SubdomainSection';

interface Props extends SectionSharedProps {
  domain?: Domain;
}

export default function DomainSection({ domain, geog, onExploreTopic }: Props) {
  if (!domain) return null;

  return (
    <div className={styles.wrapper}>
      <h2>{domain.name}</h2>
      <div className={styles.description}>{domain.description}</div>
      {domain.subdomains.map(subdomain => (
        <SubdomainSection
          key={subdomain.slug}
          subdomain={subdomain}
          geog={geog}
          onExploreTopic={onExploreTopic}
        />
      ))}
    </div>
  );
}
