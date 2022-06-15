import { Resource, TagRecord } from '@wprdc-types/shared';
import { ContextItem } from './context';
import { IndicatorBaseWithOptions } from './indicator';

export * from './context';
export * from './indicator';
export * from './source';
export * from './time';
export * from './variable';

interface TopicHierarchy {
  domain: Resource;
}

export interface TopicBrief extends Resource {}

export interface Topic extends Resource {
  longDescription: string;
  fullDescription: string;
  limitations: string;
  importance: string;
  source: string;
  provenance: string;
  indicators: IndicatorBaseWithOptions[];
  hierarchies: TopicHierarchy[];
  tags: TagRecord[];
  context: ContextItem[];
  primaryIndicatorIDs: IndicatorBaseWithOptions['id'][];
}

export interface Domain extends Resource {
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

export interface ProfilesMapProperties extends Resource {}
