import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/Explorer.module.css';

import { GeographyPicker } from '@wprdc-widgets/geography-picker';
import { useTaxonomy } from '@wprdc-connections/profiles';
import { ProjectKey } from '@wprdc-types/shared';
import {
  defaultGeogLevelListBoxProps,
  defaultGeogListBoxProps,
  geographyTypeConnection,
  makeGeographyConnection,
  menuLayerConnection,
  useGeography,
  useGeographyLevels,
} from '@wprdc-connections/geo';
import { ConnectedSelect, Select } from '@wprdc-components/select';
import { useWindowSize } from '@wprdc-connections/util';
import { GeogBrief, GeogLevel } from '@wprdc-types/geo';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { LayerPanelVariant } from '@wprdc-types/map';
import {
  ConnectedMapEventHandler,
  ConnectionCollection,
} from '@wprdc-types/connections';
import { BreadcrumbItem, Breadcrumbs } from '@wprdc-components/breadcrumbs';
import { IndicatorBase } from '@wprdc-types/profiles';
import { Topic } from '@wprdc-types/profiles';
import { Map } from '@wprdc-components/map';
import { useProvider } from '@wprdc-components/provider';
import { TaxonomySection } from '../../components/TaxonomySection';
import { Item } from '@wprdc-components/util';

export default function Home() {
  // state
  const [geogLevel, setGeogLevel] = useState<GeogLevel>();
  const [geogSlug, setGeogSlug] = useState<string>();
  const [pathSlugs, setPathSlugs] = useState<string[]>([]);
  const [domainSlug, subdomainSlug, topicSlug, indicatorSlug] = pathSlugs;

  // hooks
  const context = useProvider();
  const { geogLevels } = useGeographyLevels();
  const { taxonomy } = useTaxonomy('child-health-explorer');
  const { geog } = useGeography(geogSlug);

  // handling browser state
  const { width } = useWindowSize();
  const onSmallScreen = !!width && width < 768;

  const router = useRouter();

  // set geog in the global context
  useEffect(() => {
    context.setGeog(geog);
  }, [geog]);

  // when the url changes
  useEffect(() => {
    // todo: this effect is run when the url changes, however there is a huge lag in rendering afterwards

    if (!!geogLevels && !!taxonomy) {
      // first check geog or taxonomy are missing or malformed.
      //  if so, push with a default(s) added
      let defaultGeog, defaultTaxonomyPath;
      if (!router.query.geog || typeof router.query.geog !== 'string') {
        defaultGeog = 'county-42003';
      }
      if (!router.query.slugs || !router.query.slugs.length) {
        defaultTaxonomyPath = `/explore/${taxonomy.domains[0].slug}/`;
      }

      // if any defaults are used, they must be pushed to the router history
      if (!!defaultGeog || !!defaultTaxonomyPath) {
        router.push(
          {
            pathname: defaultTaxonomyPath || router.pathname,
            query: { geog: defaultGeog || router.query.geog },
          },
          undefined,
          { shallow: true }, // prevents trapping of back-button
        );
      } else {
        // when the geog and taxonomy are both present in the url
        // if geog is not a non-empty string, a default would have been made
        const gSlug = router.query.geog as string;
        // find geogLevel for the geog
        const geogLevelSlug = gSlug.slice(0, gSlug.lastIndexOf('-'));
        const glevel = geogLevels.find(g => g.slug === geogLevelSlug);

        // ensure `slugs` is an array
        const slugs: string[] =
          typeof router.query.slugs === 'string'
            ? [router.query.slugs]
            : (router.query.slugs as string[]); // would have default if undefined

        // update state
        setPathSlugs(slugs);
        setGeogSlug(gSlug);
        setGeogLevel(glevel);
      }
    }
  }, [router.pathname, router.query, geogLevels, taxonomy]);
  // event handlers
  function handleGeogLevelSelection(selectedGeogLevel: GeogLevel) {
    setGeogLevel(selectedGeogLevel);
  }

  function handleGeogSelection(geog?: { slug: string }) {
    if (!!geog) {
      const path = router.asPath.split('?')[0];
      router.push(`${path}/?geog=${geog.slug}`);
    }
  }

  function handleExploreIndicator(indicator: IndicatorBase): void {
    const { slugs, ...sansSlugs } = router.query;
    router.push({
      pathname: `/explore/${domainSlug}/${subdomainSlug}/${topicSlug}/${indicator.slug}/`,
      query: sansSlugs,
    });
  }

  function handleExploreTopic(topic: Topic): void {
    const { slugs, ...sansSlugs } = router.query;
    let domain: string;
    if (!!topic.hierarchies && !!topic.hierarchies.length) {
      domain = topic.hierarchies[0].domain.slug;

      router.push({
        pathname: `/explore/${domain}/${topic.slug}/`,
        query: sansSlugs,
      });
    }
  }

  function handleTabChange(domain: React.Key): void {
    router.push({
      pathname: `/explore/${domain}/`,
      query: { geog: geog?.slug },
    });
  }

  const handleClick: ConnectedMapEventHandler = (_, __, toolboxItems) => {
    if (!!toolboxItems) {
      const clickedGeogs: GeogBrief[] | undefined =
        toolboxItems[ProjectKey.GeoMenu];
      if (!!clickedGeogs && !!clickedGeogs.length) {
        handleGeogSelection(clickedGeogs[0]);
      }
    }
  };

  // make `Selection` from selected geogLevel
  const geogLevelSelection: Set<string> = useMemo(() => {
    if (!!geogLevel) return new Set([geogLevel.id]);
    return new Set();
  }, [geogLevel]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Profiles - Explorer</title>
        <meta name="description" content="Topic explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {/* Nav content */}
        <div className={styles.navMenu}>
          {!geogLevel && <LoadingMessage message="Loading geographies..." />}
          {!!geogLevel && onSmallScreen && (
            <div className={styles.geoPickerWrapper}>
              <h2 id="picker-label" className={styles.cta}>
                Select an area to explore
              </h2>
              <GeographyPicker
                aria-labelledby="picker-label"
                onSelection={handleGeogSelection}
                selectedGeog={geog}
              />
            </div>
          )}
          {!!geogLevel && !onSmallScreen && (
            <>
              <div key="geonav" className={styles.geoMenu}>
                <h2 className={styles.cta}>Select an area to explore</h2>
                <div className={styles.menuItem}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.dropdown}>
                    <div className={styles.labelText} id="geogLevelSelectLabel">
                      Pick a type of area
                    </div>
                    <ConnectedSelect<GeogLevel>
                      aria-labelledby="geogLevelSelectLabel"
                      connection={geographyTypeConnection}
                      listBoxProps={defaultGeogLevelListBoxProps}
                      onSelection={handleGeogLevelSelection}
                    />
                  </div>
                </div>
                <div className={styles.menuItem}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.dropdown}>
                    <div className={styles.labelText} id="geogSelectLabel">
                      Search for a {geogLevel.name}
                    </div>
                    <ConnectedSearchBox<GeogBrief>
                      aria-labelledby={'geogSelectLabel'}
                      connection={makeGeographyConnection(geogLevel.id)}
                      listBoxProps={defaultGeogListBoxProps}
                      onSelection={handleGeogSelection}
                    />
                  </div>
                </div>
              </div>
              <div key="or-msg" className={styles.orSection}>
                <div className={styles.orBreak}>or</div>
                <div className={styles.labelText}>Use the map</div>
              </div>
              <div key="mapnav" className={styles.map}>
                <Map
                  initialViewState={{
                    zoom: 7,
                    longitude: -79.9925,
                    latitude: 40.440624,
                  }}
                  layerPanelVariant={LayerPanelVariant.None}
                  connections={[menuLayerConnection] as ConnectionCollection}
                  onClick={handleClick}
                  connectionHookArgs={{
                    [ProjectKey.GeoMenu]: {
                      layerItems: [geogLevel],
                      layerSelection: geogLevelSelection,
                      selectedMapItem: geog,
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
        {/* Main content */}
        <div className={styles.content}>
          <div className={styles.geogContainer}>
            {!!geog ? (
              <>
                <Breadcrumbs showCurrent={false}>
                  {[{ name: 'pa', title: 'Pennsylvania' }]
                    .concat(geog.hierarchy.concat(geog))
                    .map(item => (
                      <BreadcrumbItem
                        key={item.name}
                        isDisabled={item.name === 'pa'}
                      >
                        {item.title}
                      </BreadcrumbItem>
                    ))}
                </Breadcrumbs>
                <h2 className={styles.geogTitle}>{geog.title}</h2>
              </>
            ) : (
              <LoadingMessage message="Finding geography details" />
            )}
          </div>
          <div className={styles.taxonomyContainer}>
            {!!taxonomy && !!domainSlug ? (
              <TaxonomySection
                taxonomy={taxonomy}
                geog={geog}
                currentDomainSlug={domainSlug}
                currentTopicSlug={topicSlug}
                currentIndicatorSlug={indicatorSlug}
                onExploreIndicator={handleExploreIndicator}
                onExploreTopic={handleExploreTopic}
                baseHeadingLevel={3}
              />
            ) : (
              <LoadingMessage message="Loading topics" />
            )}
          </div>
        </div>
      </>
    </div>
  );
}
