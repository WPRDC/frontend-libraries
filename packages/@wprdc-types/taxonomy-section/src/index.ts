/**
 *
 * Taxonomy section types
 *
 **/
import { FC, Key } from 'react';

import { DataVizBase } from '@wprdc-types/viz';
import { GeogBrief } from '@wprdc-types/geo';
import { Indicator, Taxonomy } from '@wprdc-types/profiles';
import { BreadcrumbItemLinkProps } from '@wprdc-types/breadcrumbs';

export interface TaxonomySectionProps extends SectionSharedProps {
  taxonomy: Taxonomy;

  currentDomainSlug?: string;
  currentDomainHref?: string;

  currentSubdomainSlug?: string;
  currentSubdomainHref?: string;

  currentIndicatorSlug?: string;
  currentIndicatorHref?: string;

  currentDataVizSlug?: string;
  currentDataVizHref?: string;

  LinkComponent?: FC<BreadcrumbItemLinkProps>;

  onTabsChange?: (tab: Key) => any;
}

export interface SectionSharedProps {
  geog?: GeogBrief;
  onExploreIndicator?: (indicator: Indicator) => void;
  onExploreDataViz?: (dataViz: DataVizBase) => void;
  onCompareIndicator?: (indicator: Indicator) => void;
}
