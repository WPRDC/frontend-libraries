import * as React from 'react';

import { ListConnection } from '@wprdc-types/shared';
import { ListBoxOptions, ResourceOptionTemplateOptions } from '@wprdc-types/list-box';
import { ProjectIndex } from '@wprdc-types/housecat';

import { ResourceOptionTemplate } from '@wprdc-components/list-box';
import { Item } from '@wprdc-components/util';

import { RiCommunityFill } from 'react-icons/ri';
import { getCookie } from '@wprdc-connections/util';

const headers = {
  'Content-Type': 'application/json',
  'X-CSRFToken': getCookie('csrftoken') || '',
};

export const affordableHousingProjectConnection: ListConnection<ProjectIndex> =
  {
    async load({ signal, cursor, filterText }) {
      const res = await fetch(
        cursor ||
        `https://housecatpgh.org/api/data/project/?search=${filterText}&limit=10`,
        { signal, headers, credentials: 'include' },
      );
      const json = await res.json();

      return {
        items: json.results,
        cursor: json.next,
      };
    },
    renderItem: (item) => <Item key={item.id}>{item.name}</Item>,
    getKey: (item) => item.id.toString(),
  };

/** style props */
export const defaultAffordableHousingListBoxProps: ListBoxOptions<ProjectIndex,
  ResourceOptionTemplateOptions<ProjectIndex>> = {
  optionTemplate: ResourceOptionTemplate,
  optionTemplateOptions: {
    Icon: RiCommunityFill,
    subtitleAccessor: 'propertyStreetAddress',
  },
};

export const makeWatchlistConnection = (slug: string) =>
  ({
    async load({ signal }) {
      const res = await fetch(
        `https://api.profiles.wprdc.org/public-housing/watchlist/${slug}?limit=5000`,
        { signal, headers },
      );
      const json = await res.json();

      return {
        items: json.projectIndices,
      };
    },
    renderItem: (item) => <Item key={item.id}>{item.name}</Item>,
    getKey: (item) => item.id.toString(),
  } as ListConnection<ProjectIndex>);
