import {
  Domain,
  IndicatorWithData,
  Taxonomy,
  Topic,
} from '@wprdc-types/profiles';
import { ProfilesAPI } from './api';
import { useQuery, UseQueryResult } from 'react-query';

const staleTime = 1000 * 60 * 5;

export function useTopic(topicSlug?: string): UseQueryResult<Topic> {
  return useQuery(
    ['topic', topicSlug],
    () => ProfilesAPI.requestTopic(topicSlug),
    { enabled: !!topicSlug, staleTime }
  );
}

export function useDomain(slug?: string): UseQueryResult<Domain> {
  return useQuery<Domain>(
    ['domain', slug],
    () => ProfilesAPI.requestDomain(slug),
    { enabled: !!slug, staleTime }
  );
}

export function useIndicator(
  indicatorSlug?: string,
  geogSlug?: string,
  acrossGeogs?: boolean
): UseQueryResult<IndicatorWithData, Error> {
  return useQuery<IndicatorWithData, Error>(
    ['domain', indicatorSlug, geogSlug, acrossGeogs],
    () => ProfilesAPI.requestIndicator(indicatorSlug, geogSlug, acrossGeogs),
    { enabled: !!indicatorSlug && !!geogSlug, staleTime }
  );
}

export function useTaxonomy(slug?: string): UseQueryResult<Taxonomy> {
  return useQuery<Taxonomy>(
    ['domain', slug],
    () => ProfilesAPI.requestTaxonomy(slug),
    { enabled: !!slug, staleTime }
  );
}
