import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../../styles/Compare.module.css';
import { serializeParams } from '@wprdc-connections/api';
import {
  defaultTopicListBoxProps,
  topicConnection,
  useTopic,
} from '@wprdc-connections/profiles';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { useGeography } from '@wprdc-connections/geo';
import { GeogBrief } from '@wprdc-types/geo';
import { GeographyPicker } from '@wprdc-widgets/geography-picker';
import { Topic, TopicBrief } from '@wprdc-types/profiles';
import { TopicView } from '@wprdc-widgets/topic-view';

const DEFAULT_PARAMS: Record<'g1' | 'g2' | 'i', string> = {
  g1: 'county-42003',
  g2: 'county-42003',
  i: 'total-population',
};

export default function TopicComparisonPage() {
  const [topicSlug, setTopicSlug] = useState<string>();
  const [geogSlugA, setGeogSlugA] = useState<string>();
  const [geogSlugB, setGeogSlugB] = useState<string>();

  const router = useRouter();

  const { data: geogA } = useGeography(geogSlugA);
  const { data: geogB } = useGeography(geogSlugB);
  const { data: topic } = useTopic(topicSlug);

  useEffect(() => {
    let useDefaults = false;
    if (router.query) {
      const { g1, g2, i } = router.query;

      if (typeof g1 === 'string') setGeogSlugA(g1);
      else useDefaults = true;

      if (typeof g2 === 'string') setGeogSlugB(g2);
      else useDefaults = true;

      if (typeof i === 'string') setTopicSlug(i);
      else useDefaults = true;
    }

    if (useDefaults) {
      const path = router.asPath.split('?')[0];
      router.push(
        `${path}/${serializeParams({ ...DEFAULT_PARAMS, ...router.query })}`,
      );
    }
  }, [router.query]);

  const handleGeogSelection = (id: 'a' | 'b') => (gb: GeogBrief) => {
    const paramKey = { a: 'g1', b: 'g2' }[id];
    const path = router.asPath.split('?')[0];
    const newParams = { ...router.query, [paramKey]: gb.slug };

    router.push(`${path}/${serializeParams(newParams)}`);
  };

  function handleTopicSelection(topic: Topic) {
    const path = router.asPath.split('?')[0];
    router.push(
      `${path}/${serializeParams({ ...router.query, i: topic.slug })}`,
    );
  }

  function handleExploreTopic(topic: Topic) {
    router.push(
      `topic/${topic.slug}/${serializeParams({
        g1: geogSlugA,
        g2: geogSlugB,
      })}`,
    );
  }

  function handleExploreIndicator(topic: TopicBrief) {
    router.push(
      `../data-viz/${topic.slug}/${serializeParams({
        g1: geogSlugA,
        g2: geogSlugB,
      })}`,
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topicSection}>
        <h1 className={styles.cta}>Pick an topic to compare: </h1>
        <ConnectedSearchBox
          connection={topicConnection}
          listBoxProps={defaultTopicListBoxProps}
          onSelection={handleTopicSelection}
        />
      </div>
      <div className={styles.dashboard}>
        <div className={styles.dashboardSection}>
          <div className={styles.geoSection}>
            <GeographyPicker
              label="Select a community"
              onSelection={handleGeogSelection('a')}
              selectedGeog={geogA}
            />
            <h2 className={styles.geogTitle}>
              {geogA ? geogA.title : 'no geography selected'}
            </h2>
          </div>
          <div className={styles.indSection}>
            <TopicView topic={topic} geog={geogA} />
          </div>
        </div>
        <div className={styles.dashboardSection}>
          <div className={styles.geoSection}>
            <GeographyPicker
              label="Select a community"
              onSelection={handleGeogSelection('b')}
              selectedGeog={geogB}
            />
            <h2 className={styles.geogTitle}>
              {geogB ? geogB.title : 'no geography selected'}
            </h2>
          </div>
          <div className={styles.indSection}>
            <TopicView topic={topic} geog={geogB} />
          </div>
        </div>
      </div>
    </div>
  );
}
