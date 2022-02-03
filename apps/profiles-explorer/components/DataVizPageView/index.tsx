import { DataVizVariant, ErrorMessage, LoadingMessage } from '@wprdc/toolkit';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import {
  useGeography,
  dataVizConnection,
  defaultVizListBoxProps,
  useDataViz,
  ConnectedSearchBox,
  GeogBrief,
  serializeParams,
  DataVizID,
  DataViz,
} from '@wprdc/toolkit';

import styles from '../../styles/Indicator.module.css';
import DataVizLandingPage from '../../parts/DataVizLandingPage';
import { DEFAULT_GEOG_SLUG } from '../../settings';

export default function DataVizPageView({ embed }: { embed?: boolean }) {
  const [slug, setSlug] = useState<string>();
  const [geogSlug, setGeogSlug] =
    useState<string | undefined>(DEFAULT_GEOG_SLUG);

  const router = useRouter();

  const base_path = embed ? 'embed' : 'explore';

  const { geog } = useGeography(geogSlug);
  const {
    dataViz,
    isLoading: dvLoading,
    error: dvError,
  } = useDataViz(slug, geogSlug);

  // handle query params
  useEffect(() => {
    const { slug: _slug, g, ...params } = router.query;
    // read indicator slug from path
    if (!!_slug && _slug.length) setSlug(_slug[0]);
    // read geography
    if (typeof g === 'string') setGeogSlug(g);
    // if no geog provided, add default param to url
    else if (!g && !!slug) {
      console.log('what!?');
      router.push(
        `/${base_path}/indicator/${slug}/${serializeParams({
          ...params,
          g: DEFAULT_GEOG_SLUG,
        })}`,
      );
    }
  }, [router.query]);

  function handleGeogSelection(g: GeogBrief) {
    const { slug: _, ...params } = router.query;
    router.push(
      `/${base_path}/data-viz/${slug}/${serializeParams({
        ...params,
        g: g.slug,
      })}`,
    );
  }

  function handleDataVizSelection(d: DataVizID) {
    const { slug: _, ...params } = router.query;
    router.push(`/${base_path}/data-viz/${d.slug}/${serializeParams(params)}`);
  }

  // determine the content to display in the main section
  const mainContent = useMemo(() => {
    // landing page requested `/`
    if (!dataViz && !dvLoading && !dvError) return <DataVizLandingPage />;
    // loading
    if (!!dvLoading)
      return (
        <div className={styles.loadingWrapper}>
          <LoadingMessage message="Loading indicator..." />
        </div>
      );
    // indicator requested
    if (!!dataViz)
      return (
        <DataViz
          variant={DataVizVariant.Details}
          dataViz={dataViz}
          showGeog={!embed}
          onGeogSelection={handleGeogSelection}
          geog={geog}
        />
      );
    // finally error
    return (
      <div className={styles.loadingWrapper}>
        <ErrorMessage title="Error" message={dvError || 'Unknown error'} />
      </div>
    );
  }, [slug, dataViz, dvError, dvLoading]);

  return (
    <div className={embed ? styles.embedWrapper : styles.wrapper}>
      {!embed && (
        <div className={styles.searchSection}>
          <p className={styles.searchLabel} id="search-label">
            Search for another Data Viz
          </p>
          <ConnectedSearchBox
            aria-labelledby="search-label"
            connection={dataVizConnection}
            listBoxProps={defaultVizListBoxProps}
            onSelection={handleDataVizSelection}
            inputValue={dataViz && dataViz.name}
            selectedKey={slug}
          />
        </div>
      )}
      <main className={styles.mainSection}>{mainContent}</main>
    </div>
  );
}
