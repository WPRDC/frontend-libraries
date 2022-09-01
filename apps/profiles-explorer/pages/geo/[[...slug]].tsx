import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/Geo.module.css';
import { Map } from '@wprdc-components/map';
import { DEFAULT_GEOG_SLUG } from '../../settings';
import { serializeParams } from '@wprdc-connections/api';
import { LayerPanelVariant } from '@wprdc-types/map';
import { useGeography, useGeographyLevels } from '@wprdc-connections/geo';
import {
  LayerMenuItem,
  LayerMenuItemProps,
} from '../../components/LayerMenuItem';

type GeogLevelOptions = Omit<LayerMenuItemProps, 'geogLevel'>;

export default function GeogPage() {
  const [geogSlug, setGeogSlug] = useState<string>();
  const [geogLevelOptions, setGeogLevelOptions] = useState<
    Record<string, GeogLevelOptions>
  >({});

  const router = useRouter();
  const { data: geogLevels } = useGeographyLevels();
  const { data: geog } = useGeography(geogSlug);

  function handleMenuItemChange(slug: string, options: GeogLevelOptions) {
    setGeogLevelOptions({ ...geogLevelOptions, [slug]: options });
  }

  // handle query params
  useEffect(() => {
    const { slug: _slug, ...params } = router.query;
    // read data viz slug from path
    if (!!_slug && _slug.length) setGeogSlug(_slug[0]);
    // if no geog provided, add default param to url
    else if (!!_slug) {
      router.push(
        `/geo/${geogSlug}/${serializeParams({
          ...params,
          g: DEFAULT_GEOG_SLUG,
        })}`,
      );
    }
  }, [router.query]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.navSection}>
        <div className={styles.menuSection}>
          {!!geogLevels &&
            geogLevels.map(geogLevel => (
              <LayerMenuItem
                key={geogLevel.slug}
                geogLevel={geogLevel}
                {...geogLevelOptions[geogLevel.slug]}
              />
            ))}
        </div>
      </div>
      <div className={styles.mapSection}>
        <Map layerPanelVariant={LayerPanelVariant.None} />
      </div>
      <div className={styles.dashboardSection}></div>
    </div>
  );
}

GeogPage.getLayout = function getLayout(page: React.ReactChildren) {
  return <Layout>{page}</Layout>;
};
