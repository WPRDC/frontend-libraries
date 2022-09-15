import { Geog } from '@wprdc-types/geo';
import { ColorScheme } from '@wprdc-types/shared';
import { Dispatch, Reducer } from 'react';

import { QueryClient} from 'react-query'

export interface ProviderAction {
  type: string;
  payload?: unknown;
}

export interface ProviderProps extends ProviderState {
  usingSSR?: boolean;
  reducer?: Reducer<ProviderState, ProviderAction>;
  children?: React.ReactNode;
  queryClient?: QueryClient;

}

export interface ProviderState {
  colorScheme?: ColorScheme;
  mapboxAPIToken?: string;
  geog?: Geog;
  housecatHost?: string
  profilesHost?: string
}

export interface ProviderContext extends ProviderState {
  dispatch: Dispatch<ProviderAction>;
  setGeog: (geog?: Geog) => void;
}
