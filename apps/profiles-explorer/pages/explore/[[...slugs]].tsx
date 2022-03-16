import Head from 'next/head';
import Link from 'next/link';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/Explorer.module.css';

import { GeographyPicker } from '@wprdc-widgets/geography-picker';
import { useTaxonomy } from '@wprdc-connections/profiles';
import { ProjectKey } from '@wprdc-types/shared';
import {
  defaultGeogLevelListBoxProps,
  defaultGeogListBoxProps,
  GeoAPI,
  geographyTypeConnection,
  makeGeographyConnection,
  menuLayerConnection,
  useGeography,
} from '@wprdc-connections/geo';
import { ConnectedSelect } from '@wprdc-components/select';
import { useWindowSize } from '@wprdc-connections/util';
import { GeogBrief, GeogLevel } from '@wprdc-types/geo';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { useProvider } from '@wprdc-components/provider';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { LayerPanelVariant } from '@wprdc-types/map';
import {
  ConnectedMapEventHandler,
  ConnectionCollection,
} from '@wprdc-types/connections';
import { TaxonomySection } from '@wprdc-widgets/taxonomy-section';
import { BreadcrumbItem, Breadcrumbs } from '@wprdc-components/breadcrumbs';
import { DataVizBase } from '@wprdc-types/viz';
import { Indicator } from '@wprdc-types/profiles';
import { serializeParams } from '@wprdc-connections/api';
import { Map } from '@wprdc-widgets/map';

export default function Home() {
  // state
  const [geogLevels, setGeogLevels] = useState<GeogLevel[]>();
  const [geogLevel, setGeogLevel] = useState<GeogLevel>();
  const [geogSlug, setGeogSlug] = useState<string>();
  const [pathSlugs, setPathSlugs] = useState<string[]>([]);

  const [domainSlug, subdomainSlug, indicatorSlug, dataVizSlug] = pathSlugs;

  // hooks
  const context = useProvider();
  const { taxonomy } = useTaxonomy('child-health-explorer');
  const { geog } = useGeography(geogSlug);
  console.log({ geogSlug, geog });
  // handling browser state
  const { width } = useWindowSize();
  const onSmallScreen = !!width && width < 768;

  const router = useRouter();

  // update state when path updates
  useEffect(() => {
    if (!!router.query.slugs) {
      const slugs: string[] =
        typeof router.query.slugs === 'string'
          ? [router.query.slugs]
          : router.query.slugs;
      setPathSlugs(slugs);
    } else {
      setPathSlugs([]);
    }
  }, [router.query.slugs]);

  // update state when geog param is passed
  useEffect(() => {
    if (typeof router.query.geog === 'string') {
      console.log('UPDATE', router);
      setGeogSlug(router.query.geog);
    } else {
      router.push(`${router.pathname}?geog=county-42003`);
    }
  }, [router.query]);

  useEffect(() => {
    context.setGeog(geog);
  }, [geog]);

  // initialization
  useEffect(() => {
    // get available geography levels
    GeoAPI.requestGeoLayers().then(({ data }) => {
      if (!!data && !!data.length) {
        setGeogLevels(data);
        setGeogLevel(data[0]);
      }
    });
  }, []);

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

  function handleExploreDataViz(dataViz: DataVizBase): void {
    router.push(
      `/explore/${domainSlug}/${subdomainSlug}/${indicatorSlug}/${
        dataViz.slug
      }/${serializeParams(router.query)}`,
    );
  }

  function handleExploreIndicator(indicator: Indicator): void {
    let domain: string, subdomain: string;
    if (!!indicator.hierarchies && !!indicator.hierarchies.length) {
      domain = indicator.hierarchies[0].domain.slug;
      subdomain = indicator.hierarchies[0].subdomain.slug;
      router.push(
        `/explore/${domain}/${subdomain}/${indicator.slug}/${serializeParams(
          router.query,
        )}`,
      );
    }
  }

  function handleTabChange(domain: React.Key): void {
    router.push(
      `/explore/${domain}/${serializeParams(router.query)}`,
      undefined,
      { shallow: true },
    );
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

  // rendering
  const navContent = useMemo(() => {
    if (!geogLevel) {
      return <LoadingMessage message="Loading geographies..." />;
    }
    if (onSmallScreen) {
      return (
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
      );
    } else {
      return [
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
        </div>,
        <div key="or-msg" className={styles.orSection}>
          <div className={styles.orBreak}>or</div>
          <div className={styles.labelText}>Use the map</div>
        </div>,
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
              },
            }}
          />
        </div>,
      ];
    }
  }, [geogLevel, onSmallScreen, geogLevelSelection]);

  const mainContent = (
    <div className={styles.content}>
      <div className={styles.geogContainer}>
        {!!geog ? (
          <>
            <Breadcrumbs>
              {[{ name: 'pa', title: 'Pennsylvania' }]
                .concat(geog.hierarchy.concat(geog))
                .map((item) => (
                  <BreadcrumbItem key={item.name}>{item.title}</BreadcrumbItem>
                ))}
            </Breadcrumbs>
            <h2 className={styles.geogTitle}>{geog.title}</h2>
          </>
        ) : (
          <LoadingMessage message="Finding geography details" />
        )}
      </div>
      <div className={styles.taxonomyContainer}>
        {!!taxonomy ? (
          <TaxonomySection
            taxonomy={taxonomy}
            currentDomainSlug={domainSlug}
            currentSubdomainSlug={subdomainSlug}
            currentIndicatorSlug={indicatorSlug}
            currentDataVizSlug={dataVizSlug}
            onExploreDataViz={handleExploreDataViz}
            onExploreIndicator={handleExploreIndicator}
            onTabsChange={handleTabChange}
            LinkComponent={Link}
          />
        ) : (
          <LoadingMessage message="Loading indicators" />
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Profiles - Explorer</title>
        <meta name="description" content="Indicator explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <div className={styles.navMenu}>{navContent}</div>
        {mainContent}
      </>
    </div>
  );
}
