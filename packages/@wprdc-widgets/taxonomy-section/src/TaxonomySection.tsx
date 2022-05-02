import * as React from 'react';

import styles from './TaxonomySection.module.css';

import { Item } from '@wprdc-components/util';

import { BreadcrumbItemProps } from '@wprdc-types/breadcrumbs';
import { DataVizVariant } from '@wprdc-types/data-viz';
import { TaxonomySectionProps } from '@wprdc-types/taxonomy-section';
import { Domain, Indicator } from '@wprdc-types/profiles';
import { DataVizBase } from '@wprdc-types/viz';

import { Breadcrumbs, BreadcrumbItem } from '@wprdc-components/breadcrumbs';
import { Tabs } from '@wprdc-components/tabs';

import { ConnectedDataViz } from '@wprdc-widgets/data-viz';
import { IndicatorView } from '@wprdc-widgets/indicator-view';

import DomainSection from './DomainSection';

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({
  taxonomy,
  geog,
  onExploreIndicator,
  onExploreDataViz,
  currentDomainSlug,
  currentDomainHref,
  currentSubdomainSlug,
  currentSubdomainHref,
  currentIndicatorSlug,
  currentIndicatorHref,
  currentDataVizSlug,
  currentDataVizHref,
  LinkComponent,
  onTabsChange,
}: TaxonomySectionProps) => {
  function handleExploreIndicator(indicator: Indicator) {
    if (!!onExploreIndicator) onExploreIndicator(indicator);
  }

  function handleExploreDataViz(dataViz: DataVizBase) {
    if (!!onExploreDataViz) onExploreDataViz(dataViz);
  }

  const currentDomain = taxonomy.domains.find(
    (d) => d.slug === currentDomainSlug
  );

  const currentSubdomain = React.useMemo(
    () =>
      currentDomain &&
      currentDomain.subdomains.find((s) => s.slug === currentSubdomainSlug),
    [currentDomainSlug, currentSubdomainSlug]
  );
  const currentIndicator = React.useMemo(
    () =>
      currentSubdomain &&
      currentSubdomain.indicators.find((i) => i.slug === currentIndicatorSlug),
    [currentDomainSlug, currentSubdomain, currentIndicatorSlug]
  );
  const currentDataViz = React.useMemo(
    () =>
      currentIndicator &&
      currentIndicator.dataVizes.find((dv) => dv.slug === currentDataVizSlug),
    [
      currentDomainSlug,
      currentSubdomain,
      currentIndicatorSlug,
      currentDataVizSlug,
    ]
  );
  console.log('T Geog', geog);
  let breadcrumbs: BreadcrumbItemProps[] = [];
  if (currentDomain)
    breadcrumbs.push({
      key: 'domain',
      href:
        currentDomainHref || `/explore/${currentDomainSlug}?geog=${geog?.slug}`,
      children: currentDomain.name,
      LinkComponent,
    });
  if (currentSubdomain)
    breadcrumbs.push({
      key: 'subdomain',
      href:
        currentSubdomainHref ||
        `/explore/${currentDomainSlug}/${currentSubdomainSlug}?geog=${geog?.slug}`,
      children: currentSubdomain.name,
      LinkComponent,
    });
  if (currentIndicator)
    breadcrumbs.push({
      key: 'indicator',
      href:
        currentIndicatorHref ||
        `/explore/${currentDomainSlug}/${currentSubdomainSlug}/${currentIndicatorSlug}?geog=${geog?.slug}`,
      children: currentIndicator.name,
      LinkComponent,
    });
  if (currentDataViz)
    breadcrumbs.push({
      key: 'dataViz',
      href:
        currentDataVizHref ||
        `/explore/${currentDomainSlug}/${currentSubdomainSlug}/${currentIndicatorSlug}/${currentDataVizSlug}?geog=${geog?.slug}`,
      children: currentDataViz.name,
      LinkComponent,
    });

  // controls tabs from outside if necessary
  let selectedDomain;
  if (!!onTabsChange) {
    selectedDomain = currentDomainSlug;
  }

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs>
        {breadcrumbs.map((breadcrumb) => (
          <BreadcrumbItem {...breadcrumb} />
        ))}
      </Breadcrumbs>
      <div className={styles.content}>
        {!!currentDataViz && (
          <ConnectedDataViz
            variant={DataVizVariant.Details}
            dataVizSlug={currentDataViz.slug}
            geog={geog}
            onExplore={onExploreDataViz}
          />
        )}
        {!currentDataViz && !!currentIndicator && (
          <IndicatorView
            indicator={currentIndicator}
            geog={geog}
            onExploreDataViz={onExploreDataViz}
          />
        )}
        {!currentDataViz && !currentIndicator && (
          <Tabs<Domain>
            items={taxonomy.domains}
            selectedKey={selectedDomain}
            onSelectionChange={onTabsChange}
          >
            {(domain) => (
              <Item key={domain.slug} title={domain.name}>
                <DomainSection
                  domain={domain}
                  geog={geog}
                  onExploreDataViz={handleExploreDataViz}
                  onExploreIndicator={handleExploreIndicator}
                />
              </Item>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
};
