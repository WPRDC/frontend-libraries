import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';

import styles from '../../styles/ItemPage.module.css';
import IndicatorLandingPage from '../../parts/IndicatorLandingPage';
import { DEFAULT_GEOG_SLUG } from '../../settings';
import { defaultIndicatorListBoxProps, indicatorConnection, useIndicator } from '@wprdc-connections/profiles';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { useGeography } from '@wprdc-connections/geo';
import { serializeParams } from '@wprdc-connections/api';
import { GeogBrief } from '@wprdc-types/geo';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { ErrorMessage } from '@wprdc-components/error-message';
import { Indicator } from '@wprdc-types/profiles';
import { IndicatorView } from '@wprdc-widgets/indicator-view';

export default function IndicatorPageView({ embed }: { embed?: boolean }) {
  const [slug, setSlug] = useState<string>();
  const [geogSlug, setGeogSlug] =
    useState<string | undefined>(DEFAULT_GEOG_SLUG);

  const base_path = embed ? 'embed' : 'explore';

  const router = useRouter();

  const { geog } = useGeography(geogSlug);

  const {
    indicator,
    isLoading: indLoading,
    error: indError,
  } = useIndicator(slug);

  // handle query params
  useEffect(() => {
    const { slug: _slug, g, ...params } = router.query;
    // read indicator slug from path
    if (!!_slug && _slug.length) setSlug(_slug[0]);
    // read geography
    if (typeof g === 'string') setGeogSlug(g);
    // if no geog provided, add default param to url
    else if (!g && !!slug) {
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
      `/${base_path}/indicator/${slug}/${serializeParams({
        ...params,
        g: g.slug,
      })}`,
    );
  }

  function handleIndicatorSelection(i: Indicator) {
    const { slug: _, ...params } = router.query;
    router.push(`/${base_path}/indicator/${i.slug}/${serializeParams(params)}`);
  }

  // determine the content to display in the main section
  const mainContent = useMemo(() => {
    // landing page requested `/`
    if (!indicator && !indLoading && !indError) return <IndicatorLandingPage />;
    // loading
    if (!!indLoading)
      return (
        <div className={styles.loadingWrapper}>
          <LoadingMessage message="Loading indicator..." />
        </div>
      );
    // indicator requested
    if (!!indicator)
      return (
        <IndicatorView
          indicator={indicator}
          showGeog
          onGeogSelection={handleGeogSelection}
          geog={geog}
        />
      );
    // finally error
    return (
      <div className={styles.loadingWrapper}>
        <ErrorMessage title="Error" message={indError || 'Unknown error'} />
      </div>
    );
  }, [slug, indicator, indError, indLoading, geog, embed]);

  return (
    <div className={embed ? styles.embedWrapper : styles.wrapper}>
      {!embed && (
        <div className={styles.searchSection}>
          <p className={styles.searchLabel} id="search-label">
            Search for another indicator
          </p>
          <ConnectedSearchBox
            aria-labelledby="search-label"
            connection={indicatorConnection}
            listBoxProps={defaultIndicatorListBoxProps}
            onSelection={handleIndicatorSelection}
            inputValue={indicator && indicator.name}
            selectedKey={slug}
          />
        </div>
      )}
      <main className={styles.mainSection}>{mainContent}</main>
    </div>
  );
}
