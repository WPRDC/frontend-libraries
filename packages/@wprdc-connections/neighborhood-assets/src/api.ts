/**
 *
 * Community Assets API
 *
 * Functions and settings to communicate with Community Assets backend server.
 *
 */
import { createAPI } from '@wprdc-connections/api';
import { Asset, AssetBrief, AssetCategory } from '@wprdc-types/neighborhood-assets';

import { Method } from '@wprdc-types/api';

// project specific settings
const host = 'https://assets.wprdc.org/api/dev/assets';

export enum Endpoints {
  Assets = 'assets',
  Categories = 'categories',
  Asset_types = 'asset-types',
}

const api = createAPI<Endpoints>(host);

/**
 * Calls api endpoint to return all assets.
 *
 * @param {object} params - query params
 * @returns {Promise<Response>}
 */
export function getAssets(params: Record<string, any>) {
  return api.callAndProcessEndpoint<AssetBrief[]>(
    Endpoints.Assets,
    Method.GET,
    {
      params,
    },
  );
}

/**
 * Calls api endpoint to return single asset by ID
 *
 * @param {string | number} id - id of asset to be requested
 * @returns {Promise<Response>}
 */
export function getAssetById(id: string | number) {
  if (!id && id !== 0) throw Error('Required parameter `id` is missing');

  return api.callAndProcessEndpoint<Asset>(Endpoints.Assets, Method.GET, {
    id,
  });
}

export function getCategories() {
  return api.callAndProcessEndpoint<AssetCategory[]>(
    Endpoints.Categories,
    Method.GET,
    {},
  );
}

export const AssetsAPI = {
  getAssetById,
  getAssets,
  getCategories,
};
