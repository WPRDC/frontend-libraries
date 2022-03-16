import '../styles/globals.css';

import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '../components/Layout';
import { Provider } from '@wprdc-components/provider';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MAPBOX_KEY =
  'pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJja295ZmxndGEwbGxvMm5xdTc3M2MwZ2xkIn0' +
  '.WDBLMZYfh-ZGFjmwO82xvw';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <Provider usingSSR mapboxAPIToken={MAPBOX_KEY}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
