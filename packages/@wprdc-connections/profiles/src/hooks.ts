import {
  Domain,
  IndicatorWithData,
  Subdomain,
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

export function useSubdomain(slug?: string): UseQueryResult<Subdomain> {
  return useQuery<Subdomain>(
    ['subdomain', slug],
    () => ProfilesAPI.requestSubdomain(slug),
    { enabled: !!slug, staleTime }
  );
}

export function useIndicator(
  indicatorSlug?: string,
  geogSlug?: string,
  acrossGeogs?: boolean
): UseQueryResult<IndicatorWithData, Error> {
  const keys: any[] = ['domain', indicatorSlug];
  if (acrossGeogs && geogSlug) {
    keys.push(geogSlug.slice(0, geogSlug.lastIndexOf('-')), acrossGeogs);
  } else {
    keys.push(geogSlug);
  }
  return useQuery<IndicatorWithData, Error>(
    keys,
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
