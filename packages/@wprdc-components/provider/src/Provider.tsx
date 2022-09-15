import React, { Reducer, useContext, useReducer } from 'react';
import './main.css';
import { QueryClientProvider } from 'react-query';

import { SSRProvider } from '@react-aria/ssr';
import { OverlayProvider } from '@react-aria/overlays';
import { ReactQueryDevtools } from 'react-query/devtools';

import { Geog } from '@wprdc-types/geo';
import { ProviderAction, ProviderContext, ProviderProps, ProviderState } from '@wprdc-types/provider';

const Context = React.createContext<ProviderContext>({
  dispatch: () => {
  },
  setGeog: () => {
  },
});
Context.displayName = 'ProviderContext';

const defaultReducer: Reducer<ProviderState, ProviderAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'set-mapboxAPIToken':
      return Object.assign({}, state, { mapboxAPIToken: action.payload });
    case 'set-geog':
      return Object.assign({}, state, { geog: action.payload });
    default:
      console.warn(`${action.type} is not a valid action type.`);
      return state;
  }
};


export const Provider: React.FC<ProviderProps> = props => {
  const {
    reducer = defaultReducer,
    usingSSR,
    children,
    queryClient,
    mapboxAPIToken,
    housecatHost,
    profilesHost,
  } = props;

  const [state, dispatch] = useReducer(reducer, { mapboxAPIToken, housecatHost, profilesHost });

  function setGeog(geog?: Geog) {
    dispatch({
      type: 'set-geog',
      payload: geog,
    });
  }

  const context: ProviderContext = Object.assign({}, state, {
    dispatch,
    setGeog,
  });

  if (usingSSR) {
    return (
      <Context.Provider value={context}>
        <SSRProvider>
          <OverlayProvider>
            {!!queryClient ? <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools />
            </QueryClientProvider> : children}
          </OverlayProvider>
        </SSRProvider>
      </Context.Provider>
    );
  }
  return (
    <Context.Provider value={context}>
      <OverlayProvider>
        {!!queryClient ? <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider> : children}
      </OverlayProvider>
    </Context.Provider>
  );
};

export function useProvider() {
  const context = useContext(Context);
  return context;
}
