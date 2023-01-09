import '../styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import Layout from '../components/Layout';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { Provider } from '@wprdc-components/provider';
import { QueryClient } from 'react-query';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || '127.0.0.1:8000'
const MAPBOX_KEY = process.env.NEXT_PUBLIC_MAPBOX_KEY || ''


function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // default layout is components/Layout
  const getLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>);

  return (
    <Provider usingSSR mapboxAPIToken={MAPBOX_KEY} queryClient={queryClient} profilesHost={API_HOST}>
      {getLayout(<Component {...pageProps} />)}
    </Provider>
  );
}

export default MyApp;
