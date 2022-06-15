/**
 *
 * Profiles API
 *
 * Settings and functions that handle communicating with profiles backend.
 *
 */
import { createAPI } from '@wprdc-connections/api';
import { Method, ResponsePackage } from '@wprdc-types/api';

import {
  Topic,
  Taxonomy,
  IndicatorWithData,
  Domain,
} from '@wprdc-types/profiles';

// const HOST = 'https://api.profiles.wprdc.org';
const HOST = 'http://localhost:8000';

enum Endpoint {
  Taxonomy = 'taxonomy',
  Domain = 'domain',
  // Subdomain = 'subdomain', // might not be necessary to use here
  Topic = 'topic', //   or here
  Indicator = 'indicator',
}

const api = createAPI<Endpoint>(HOST);

function requestTaxonomy(
  slug?: string,
  controller?: AbortController
): Promise<ResponsePackage<Taxonomy>> {
  return api.callAndProcessEndpoint<Taxonomy>(Endpoint.Taxonomy, Method.GET, {
    id: slug,
    controller,
  });
}

function requestDomain(
  slug?: string,
  controller?: AbortController
): Promise<ResponsePackage<Domain>> {
  return api.callAndProcessEndpoint<Domain>(Endpoint.Domain, Method.GET, {
    id: slug,
    controller,
  });
}

function requestTopic(
  slug?: string,
  controller?: AbortController
): Promise<ResponsePackage<Topic>> {
  return api.callAndProcessEndpoint<Topic>(Endpoint.Topic, Method.GET, {
    id: slug,
    controller,
  });
}

function requestIndicator(
  indicatorSlug: string,
  geogSlug: string,
  controller?: AbortController
): Promise<ResponsePackage<IndicatorWithData>> {
  return api.callAndProcessEndpoint<IndicatorWithData>(
    Endpoint.Indicator,
    Method.GET,
    {
      id: indicatorSlug,
      params: { geog: geogSlug },
      controller,
    }
  );
}

export const ProfilesAPI = {
  requestTaxonomy,
  requestTopic,
  requestIndicator,
  requestDomain,
};
