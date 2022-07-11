/**
 *
 * Profiles API
 *
 * Settings and functions that handle communicating with profiles backend.
 *
 */
import { createAPI } from '@wprdc-connections/api';
import { Method } from '@wprdc-types/api';

import {
  Domain,
  IndicatorWithData,
  Taxonomy,
  Topic,
} from '@wprdc-types/profiles';

const HOST = 'https://api.profiles.wprdc.org';

enum Endpoint {
  Taxonomy = 'taxonomy',
  Domain = 'domain',
  Topic = 'topic', //   or here
  Indicator = 'indicator',
}

const api = createAPI<Endpoint>(HOST);

function requestTaxonomy(
  slug?: string,
  controller?: AbortController
): Promise<Taxonomy> {
  if (!slug) throw Error('slug not provided');

  return api.callAndProcessEndpoint<Taxonomy>(Endpoint.Taxonomy, Method.GET, {
    id: slug,
    controller,
  });
}

function requestDomain(
  slug?: string,
  controller?: AbortController
): Promise<Domain> {
  if (!slug) throw Error('slug not provided');

  return api.callAndProcessEndpoint<Domain>(Endpoint.Domain, Method.GET, {
    id: slug,
    controller,
  });
}

function requestTopic(
  slug?: string,
  controller?: AbortController
): Promise<Topic> {
  if (!slug) throw Error('slug not provided');
  return api.callAndProcessEndpoint<Topic>(Endpoint.Topic, Method.GET, {
    id: slug,
    controller,
  });
}

function requestIndicator(
  indicatorSlug?: string,
  geogSlug?: string,
  across?: boolean,
  controller?: AbortController
): Promise<IndicatorWithData> {
  if (!indicatorSlug) throw Error('indicator slug not provided');
  if (!geogSlug) throw Error('geog slug not provided');
  const acrossGeogs = !!across || undefined;
  return api.callAndProcessEndpoint<IndicatorWithData>(
    Endpoint.Indicator,
    Method.GET,
    {
      id: indicatorSlug,
      params: { geog: geogSlug, acrossGeogs },
      controller,
      validator: (indicator: IndicatorWithData) => {
        if (!!indicator.error.level) {
          console.warn(indicator.error);
          throw Error(indicator.error.message);
        }
      },
    }
  );
}

export const ProfilesAPI = {
  requestTaxonomy,
  requestTopic,
  requestIndicator,
  requestDomain,
};
