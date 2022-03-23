import { useEffect, useState } from 'react';

import { ErrorRecord } from '@wprdc-types/viz';
import { ResponsePackage } from '@wprdc-types/api';
import {
  ProjectIndex,
  ProjectIndexDetails,
  Watchlist,
} from '@wprdc-types/housecat';

import { HousecatAPI } from './api';

export function usePublicHousingProject(
  identifier?: number | string | ProjectIndex
) {
  const [affordableHousingProject, setAffordableHousingProject] =
    useState<ProjectIndexDetails>();

  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorRecord>();

  useEffect(() => {
    function handleResponse({
      data,
      error,
    }: ResponsePackage<ProjectIndexDetails>) {
      setAffordableHousingProject(data);
      if (!!error) setError({ status: 'ERROR', level: 100, message: error });
      else setError(undefined);
      setIsLoading(false);
    }

    let argID: number;
    if (typeof identifier === 'object') argID = identifier.id;
    else argID = parseInt(identifier as string);
    setIsLoading(true);
    console.log(identifier, argID);
    HousecatAPI.requestAffordableHousingProject(argID).then(handleResponse);

    return function cleanup() {};
  }, [identifier]);

  return { affordableHousingProject, error, isLoading };
}

export function useWatchlist(slug?: string) {
  const [watchlist, setWatchlist] = useState<Watchlist>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorRecord>();

  useEffect(() => {
    function handleResponse({ data, error }: ResponsePackage<Watchlist>) {
      setWatchlist(data);
      if (!!error) setError({ status: 'ERROR', level: 100, message: error });
      else setError(undefined);
      setIsLoading(false);
    }

    if (!!slug) {
      HousecatAPI.requestWatchlist(slug).then(handleResponse);
    }
  }, [slug]);

  return { watchlist, error, isLoading };
}
