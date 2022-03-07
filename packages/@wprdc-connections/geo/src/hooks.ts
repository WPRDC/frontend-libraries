import * as GeoAPI from './api';

import { useEffect, useState } from 'react';

import { Geog } from '@wprdc-types/geo';
import { ResponsePackage } from '@wprdc-types/api';

export function useGeography(geogSlug?: string) {
  const [geog, setGeog] = useState<Geog>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    console.log(geogSlug);
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
