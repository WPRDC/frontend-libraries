import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/Compare.module.css';
import { useGeography } from '@wprdc-connections/geo';
import {
  indicatorConnection,
  defaultIndicatorListBoxProps,
} from '@wprdc-connections/profiles';
import { GeogBrief } from '@wprdc-types/geo';
import { serializeParams } from '@wprdc-connections/api';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { GeographyPicker } from '@wprdc-widgets/geography-picker';
import { ConnectedViz } from '@wprdc-widgets/viz';
import { IndicatorBase } from '@wprdc-types/profiles';

export default function TopicComparisonPage() {
  const [indicatorSlug, setIndicatorSlug] = useState<string>();
  const [geogSlugA, setGeogSlugA] = useState<string>();
  const [geogSlugB, setGeogSlugB] = useState<string>();

  const router = useRouter();

  const { data: geogA } = useGeography(geogSlugA);
  const { data: geogB } = useGeography(geogSlugB);

  useEffect(() => {
    if (router.query) {
      const { g1, g2, slug } = router.query;
      if (typeof g1 === 'string') setGeogSlugA(g1);
      if (typeof g2 === 'string') setGeogSlugB(g2);
      if (typeof slug === 'string') setIndicatorSlug(slug);
    }
  }, [router.query]);

  const handleGeogSelection = (id: 'a' | 'b') => (gb: GeogBrief) => {
    const paramKey = { a: 'g1', b: 'g2' }[id];
    const path = router.asPath.split('?')[0];
    const newParams = { ...router.query, [paramKey]: gb.slug };

    router.push(`${path}/${serializeParams(newParams)}`);
  };

  function handleIndicatorSelection(indicator: IndicatorBase) {
    const path = router.asPath.split('?')[0];
    router.push(`${path}/${serializeParams({ ...router.query })}`);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topicSection}>
        <h1 className={styles.cta}>Pick an Data Viz to compare: </h1>
        <ConnectedSearchBox
          connection={indicatorConnection}
          listBoxProps={defaultIndicatorListBoxProps}
          onSelection={handleIndicatorSelection}
        />
      </div>
      <div className={styles.dashboard}>
        <div className={styles.dashboardSection}>
          <div className={styles.geoSection}>
            <GeographyPicker
              onSelection={handleGeogSelection('a')}
              selectedGeog={geogA}
            />
            <h2>{geogA ? geogA.title : 'no geography selected'}</h2>
          </div>
          <div className={styles.indSection}>
            {!!indicatorSlug && !!geogA && (
              <ConnectedViz indicatorSlug={indicatorSlug} geog={geogA} />
            )}{' '}
          </div>
        </div>
        <div className={styles.dashboardSection}>
          <div className={styles.geoSection}>
            <GeographyPicker
              onSelection={handleGeogSelection('b')}
              selectedGeog={geogB}
            />
            <h2>{geogB ? geogB.title : 'no geography selected'}</h2>
          </div>
          <div className={styles.indSection}>
            {!!indicatorSlug && !!geogB && (
              <ConnectedViz indicatorSlug={indicatorSlug} geog={geogB} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
