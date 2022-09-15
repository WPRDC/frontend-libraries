import { createAPI } from '@wprdc-connections/api';

import { Method, API } from '@wprdc-types/api';
import { APIMapBoxResponse } from '@wprdc-types/connections';
import { ProjectIndexDetails, Watchlist } from '@wprdc-types/housecat';
import { getCookie } from '@wprdc-connections/util';


import {DEFAULT_HOST} from './settings'

export enum Endpoint {
  PHProject = 'project',
  PHProjectMap = 'vector-map',
  Watchlist = 'watchlist',
}

const headers = {
  'Content-Type': 'application/json',
  'X-CSRFToken': getCookie('csrftoken'),
};


export class HousecatAPI {
  api: API;

  constructor(host?: string) {
    this.api = createAPI(host || DEFAULT_HOST);
  }

  /**
   * Request project data details or a list of projects
   *
   * If projectID is provided, details for that project will be returned.
   * if not, a list will be returned
   */
  requestAffordableHousingProject(
    projectID: number,
    params?: Record<string, string>,
  ) {
    return this.api.callAndProcessEndpoint<ProjectIndexDetails>(Endpoint.PHProject, Method.GET, {
      id: projectID,
      headers,
      params,
      credentials: 'include',
    });
  }

  requestAffordableHousingProjects(
    params?: Record<string, string>,
  ) {
    return this.api.callAndProcessEndpoint<ProjectIndexDetails>(Endpoint.PHProject, Method.GET, {
      headers,
      params,
      credentials: 'include',
    });
  }


  /**
   * Request project data in geojson format
   */
  requestPublicHousingProjectMap(params?: Record<string, any>) {
    return this.api.callAndProcessEndpoint<APIMapBoxResponse>(
      Endpoint.PHProjectMap,
      Method.GET,
      { params, headers, credentials: 'include' },
    );
  }

  requestWatchlist(slug?: string) {
    if (!slug) throw Error('slug not provided');
    return this.api.callAndProcessEndpoint<Watchlist>(Endpoint.Watchlist, Method.GET, {
      id: slug,
      headers,
      credentials: 'include',
    });
  }
}