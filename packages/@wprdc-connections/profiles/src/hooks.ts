import { useEffect, useState } from 'react';
import {
  Taxonomy,
  IndicatorWithData,
  ErrorRecord,
  Domain,
} from '@wprdc-types/profiles';
import { ResponsePackage } from '@wprdc-types/api';
import { ProfilesAPI } from './api';
import { useQuery } from 'react-query';

export function useTopic(topicSlug?: string) {
  return useQuery(['topic', topicSlug], () =>
    ProfilesAPI.requestTopic(topicSlug)
  );
}

export function useDomain(
  slug?: string
): {
  domain?: Domain;
  isLoading?: boolean;
  error?: string;
} {
  const [domain, setDomain] = useState<Domain | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    // typescript has signature for `abort` wrong
    function handleResponse({ data, error }: ResponsePackage<Domain>) {
      setDomain(data);
      setError(error);
      setIsLoading(false);
    }

    setDomain(undefined);
    if (!!slug) {
      setIsLoading(true);
      ProfilesAPI.requestDomain(slug).then(handleResponse);
    }

    return function cleanup() {};
  }, [slug]);

  return { domain, isLoading, error };
}

export function useIndicator(
  indicatorSlug?: string,
  geogSlug?: string,
  controller?: AbortController
) {
  const [indicator, setIndicator] = useState<IndicatorWithData>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorRecord>();

  useEffect(() => {
    function handleResponse({
      data,
      error, // fetch error
    }: ResponsePackage<IndicatorWithData>) {
      setIndicator(data);
      // if uncaught or other fetch error
      if (!!error) setError({ status: 'ERROR', level: 100, message: error });
      // for errors caught in backend and returned in response
      if (!!data && !!data.error && !!data.error.level) setError(data.error);
      // if no error, then clear saved error
      if (!!data && (!data.error || !data.error.level)) setError(undefined);
      setIsLoading(false);
    }

    if (!!indicatorSlug && !!geogSlug) {
      setIsLoading(true);
      ProfilesAPI.requestIndicator(indicatorSlug, geogSlug, controller).then(
        handleResponse
      );
    }

    return function cleanup() {};
  }, [indicatorSlug, geogSlug]);

  return { indicator, error, isLoading };
}

export function useTaxonomy(
  slug?: string,
  controller?: AbortController
): {
  taxonomy?: Taxonomy;
  isLoading?: boolean;
  error?: string;
} {
  const [taxonomy, setTaxonomy] = useState<Taxonomy | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    function handleResponse({ data, error }: ResponsePackage<Taxonomy>) {
      setTaxonomy(data);
      setError(error);
      setIsLoading(false);
    }

    setIsLoading(true);
    ProfilesAPI.requestTaxonomy(slug, controller).then(handleResponse);

    return function cleanup() {};
  }, []);

  return { taxonomy, isLoading, error };
}
