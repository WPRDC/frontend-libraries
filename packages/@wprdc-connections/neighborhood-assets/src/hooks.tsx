import * as AssetsAPI from './api';
import { useQuery } from 'react-query';

export function useAssetDetails(assetID: number) {
  return useQuery(['asset', assetID], () => AssetsAPI.getAssetById(assetID));
}
