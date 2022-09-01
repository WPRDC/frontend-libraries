import * as React from 'react';

import { AssetBrief, AssetType } from '@wprdc-types/neighborhood-assets';
import { Item } from '@wprdc-components/util';
import { ListConnection } from '@wprdc-types/shared';

const LIMIT = 10;

export const assetsConnection: ListConnection<AssetBrief> = {
  async load({ signal, cursor, filterText }) {
    const res = await fetch(
      cursor ||
      `https://assets.wprdc.org/api/dev/assets/assets/?limit=${LIMIT}&search=${filterText}`,
      { signal },
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

export const assetTypeConnection: ListConnection<AssetType> = {
  async load({ signal }) {
    const res = await fetch(
      `https://assets.wprdc.org/api/dev/assets/asset-types`,
      { signal },
    );
    const json = await res.json();
    return {
      items: json,
      cursor: undefined,
    };
  },
  renderItem: (item) => <Item key={item.name}>{item.title}</Item>,
  getKey: (item) => item.name,
};
