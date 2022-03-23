import * as GeoAPI from './api';

import { useEffect, useState } from 'react';

import { Geog, GeogLevel } from '@wprdc-types/geo';
import { ResponsePackage } from '@wprdc-types/api';

export function useGeography(geogSlug?: string): {
  geog?: Geog;
  isLoading?: boolean;
  error?: string;
} {
  const [geog, setGeog] = useState<Geog>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    function handleResponse({ data, error }: ResponsePackage<Geog>) {
      setGeog(data);
      setError(error);
      setIsLoading(false);
    }

    if (!!geogSlug) {
      setIsLoading(true);
      GeoAPI.requestGeogDetails(geogSlug).then(handleResponse);
    }

    return function cleanup() {};
  }, [geogSlug]);

  return { geog, isLoading, error };
}

export function useGeographyLevels(): {
  geogLevels?: GeogLevel[];
  isLoading?: boolean;
  error?: string;
} {
  const [geogLevels, setGeogLevels] = useState<GeogLevel[]>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    function handleResponse({ data, error }: ResponsePackage<GeogLevel[]>) {
      setGeogLevels(data);
      setError(error);
      setIsLoading(false);
    }

    setIsLoading(true);
    GeoAPI.requestGeoLayers().then(handleResponse);

    return function cleanup() {};
  }, []);

  return { geogLevels, isLoading, error };
}
