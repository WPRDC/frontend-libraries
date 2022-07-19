import { IndicatorWithData, Taxonomy, TopicBrief } from '@wprdc-types/profiles';
import { BreadcrumbItemLinkProps } from '@wprdc-types/breadcrumbs';
import { GeogBrief } from '@wprdc-types/geo';

export interface TaxonomySectionProps<L extends object = { href: string }>
  extends SectionSharedProps {
  taxonomy: Taxonomy;

  currentDomainSlug?: string;
  currentDomainHref?: string;

  currentSubdomainSlug?: string;
  currentSubdomainHref?: string;

  currentTopicSlug?: string;
  currentTopicHref?: string;

  currentIndicatorSlug?: string;
  currentIndicatorHref?: string;

  breadcrumbLinkComponent?: React.FC<BreadcrumbItemLinkProps>;
  linkWrapper?: React.ComponentType<L>;
  onTabsChange?: (tab: React.Key) => any;
  baseHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  basePath?: string;
}

export interface SectionSharedProps {
  geog?: GeogBrief;
  onExploreTopic?: (topic: TopicBrief) => void;
  onCompareIndicator?: (indicator: IndicatorWithData) => void;
  topicFetchController?: AbortController;
}
