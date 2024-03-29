import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import styles from '../../styles/ItemPage.module.css';
import IndicatorLandingPage from '../../parts/IndicatorLandingPage';
import { DEFAULT_GEOG_SLUG } from '../../settings';
import { GeographyPicker } from '@wprdc-widgets/geography-picker';
import { IndicatorVariant } from '@wprdc-types/data-viz';
import {
  indicatorConnection,
  defaultVizListBoxProps,
  useIndicator,
} from '@wprdc-connections/viz';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { useGeography } from '@wprdc-connections/geo';
import { serializeParams } from '@wprdc-connections/api';
import { GeogBrief } from '@wprdc-types/geo';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { ErrorMessage } from '@wprdc-components/error-message';
import { IndicatorID } from '@wprdc-types/viz';
import { Indicator } from '@wprdc-widgets/data-viz';

export default function IndicatorPageView({ embed }: { embed?: boolean }) {
  const [slug, setSlug] = useState<string>();
  const [geogSlug, setGeogSlug] = useState<string | undefined>(
    DEFAULT_GEOG_SLUG,
  );

  const router = useRouter();

  const base_path = embed ? 'embed' : 'explore';

  const { geog } = useGeography(geogSlug);
  const { indicator, isLoading: dvLoading, error: dvError } = useIndicator(
    slug,
    geogSlug,
  );

  // handle query params
  useEffect(() => {
    const { slug: _slug, g, ...params } = router.query;
    // read data viz slug from path
    if (!!_slug && _slug.length) setSlug(_slug[0]);
    // read geography
    if (typeof g === 'string') setGeogSlug(g);
    // if no geog provided, add default param to url
    else if (!g && !!slug) {
      router.push(
        `/${base_path}/data-viz/${slug}/${serializeParams({
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

  function handleIndicatorSelection(d: IndicatorID) {
    const { slug: _, ...params } = router.query;
    router.push(`/${base_path}/data-viz/${d.slug}/${serializeParams(params)}`);
  }

  // determine the content to display in the main section
  const mainContent = useMemo(() => {
    // landing page requested `/`
    if (!indicator && !dvLoading && !dvError) return <IndicatorLandingPage />;
    // loading
    if (!!dvLoading)
      return (
        <div className={styles.loadingWrapper}>
          <LoadingMessage message="Loading data viz..." />
        </div>
      );
    // data viz requested
    if (!!indicator)
      return (
        <Indicator
          variant={IndicatorVariant.Details}
          indicator={indicator}
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
  }, [slug, indicator, dvError, dvLoading, geog, embed]);

  return (
    <div className={embed ? styles.embedWrapper : styles.wrapper}>
      {!embed && (
        <div className={styles.searchSection}>
          <ConnectedSearchBox
            label="Search for another Data Viz"
            connection={indicatorConnection}
            listBoxProps={defaultVizListBoxProps}
            onSelection={handleIndicatorSelection}
            inputValue={indicator && indicator.name}
            selectedKey={slug}
          />
          <div className={styles.geogSelection}>
            <GeographyPicker
              label="Select another place"
              onSelection={handleGeogSelection}
              selectedGeog={geog}
            />
          </div>
        </div>
      )}
      <main className={styles.mainSection}>{mainContent}</main>
    </div>
  );
}
