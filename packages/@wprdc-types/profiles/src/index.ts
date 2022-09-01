import { Resource, TagRecord } from '@wprdc-types/shared';
import { ContextItem } from './context';
import { IndicatorBaseWithOptions } from './indicator';

export * from './context';
export * from './indicator';
export * from './source';
export * from './time';
export * from './variable';

type TopicHierarchy = Record<string, [Resource, Resource]>;

export interface TopicBrief extends Resource {
  hierarchies: TopicHierarchy;
}

export interface Topic extends TopicBrief {
  longDescription: string;
  fullDescription: string;
  limitations: string;
  importance: string;
  source: string;
  provenance: string;
  indicators: IndicatorBaseWithOptions[];
  tags: TagRecord[];
  context: ContextItem[];
  primaryIndicatorIDs: IndicatorBaseWithOptions['id'][];
}

export interface Domain extends Resource {
  topics: Topic[];
  subdomains: Resource[];
  tags: TagRecord[];
  context: ContextItem[];
}

export interface Subdomain extends Resource {
  topics: Topic[];
  tags: TagRecord[];
  context: ContextItem[];
}

export interface Taxonomy extends Resource {
  domains: Domain[];
}

type URLNavParamKeys =
  | 'geogType'
  | 'geogID'
  | 'domainSlug'
  | 'topicSlug'
  | 'indicatorSlug';

export type URLNavParams = Record<URLNavParamKeys, string>;

export interface ProfilesMapProperties extends Resource {
}
