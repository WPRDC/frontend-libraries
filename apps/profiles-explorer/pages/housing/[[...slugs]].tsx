import React from 'react';

import type { NextPage } from 'next';

import styles from '../../styles/Housing.module.css';

import {
  Map,
  Geog,
  GeogBrief,
  GeogLevel,
  GeographyType,
  Indicator,
  DataVizBase,
  useProvider,
  menuLayerConnection,
  useGeography,
  useTaxonomy,
  ConnectedMapEventHandler,
  ConnectionCollection,
  ProjectKey,
  LayerPanelVariant,
  LoadingMessage,
  TaxonomySection,
  serializeParams,
} from '@wprdc/toolkit';

import { useRouter } from 'next/router';
import Link from 'next/link';
import BlankLayout from '../../components/BlankLayout';
import { GeographyPicker } from '@wprdc-widgets/geography-picker';

const ReachPage: NextPage = () => {
  const [geogBrief, setGeogBrief] = React.useState<GeogBrief>(defaultGeogBrief);
  const [pathSlugs, setPathSlugs] = React.useState<string[]>([]);

  const context = useProvider();
  const { geog, isLoading, error } = useGeography(geogBrief.slug);
  const router = useRouter();

  function handleTabChange(domain: React.Key): void {
    router.push(
      `/housing/${domain}/${serializeParams(router.query)}`,
      undefined,
      {
        shallow: true,
      },
    );
  }

  const [domainSlug, subdomainSlug, indicatorSlug, dataVizSlug] = pathSlugs;

  // update state when path updates
  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!!geog) context.setGeog(geog);
  }, [geog]);

  const {
    taxonomy,
    isLoading: taxonomyIsLoading,
    error: taxonomyError,
  } = useTaxonomy('affordable-housing');

  const handleClick: ConnectedMapEventHandler = (_, __, toolboxItems) => {
    if (!!toolboxItems) {
      const clickedGeogs: GeogBrief[] | undefined =
        toolboxItems[ProjectKey.GeoMenu];
      if (!!clickedGeogs && !!clickedGeogs.length)
        setGeogBrief(clickedGeogs[0]);
    }
  };

  function handleExploreDataViz(dataViz: DataVizBase): void {
    router.push(
      `/housing/${domainSlug}/${subdomainSlug}/${indicatorSlug}/${
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
        `/housing/${domain}/${subdomain}/${indicator.slug}/${serializeParams(
          router.query,
        )}`,
      );
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.subWrapper}>
        <div className={styles.main}>
          <div className={styles.intro}>
            <div className={styles.title}>
              <a href="/housing">Housing Indicators</a>
            </div>
            <div className={styles.subtitle}>
              Indicators to inform affordable housing work
            </div>
            <p className={styles.description}>
              Flavum, clemens advenas virtualiter imperium de domesticus, alter
              lanista! Cum candidatus peregrinatione, omnes abaculuses pugna
              barbatus, domesticus accolaes! Cur lamia velum? prarere
              virtualiter ducunt ad azureus lanista! Sensorem potus foris ducunt
              ad alter hibrida. homos studere!
            </p>
            <p className={styles.description}>
              Cum axona mori, omnes particulaes imperium nobilis, brevis
              amicitiaes. Altus agripeta sensim apertos accentor est. Lotus
              byssus una visums apolloniates est. Flavum navis aliquando amors
              zirbus est. sunt classises examinare nobilis, velox danistaes.
              abaculuss tolerare!
            </p>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.geoDetails}>
            <GeographyPicker onSelection={setGeogBrief} />

            {!!geog && <div className={styles.geogTitle}>{geog.title}</div>}
          </div>
        </div>

        {!taxonomyIsLoading && !!taxonomy && (
          <div className={styles.dashboard}>
            {!!taxonomyIsLoading && (
              <div className={styles.loader}>
                <LoadingMessage message="Loading dashboard..." />
              </div>
            )}

            {taxonomy && (
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
            )}
          </div>
        )}
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
};

const defaultGeogBrief: GeogBrief = {
  id: 2213,
  name: '5140',
  slug: 'tract-42003514000',
  title: 'Tract 42003514000',
  geogType: GeographyType.Tract,
  geogID: '42003514000',
};

const geogLevels: GeogLevel[] = [
  {
    id: GeographyType.Tract,
    slug: GeographyType.Tract,
    name: 'Tracts',
    description: 'Census Tracts',
  },
];

interface GeogOverlapListingProps {
  geog: Geog;
}

function GeogOverlapListing({ geog }: GeogOverlapListingProps) {
  const hoods = geog.overlap.neighborhood;
  const munis = geog.overlap.countySubdivision;

  return (
    <div>
      {!!hoods && !!hoods.length && (
        <div>
          <div className={styles.overlapTitle}>Overlapping Neighborhoods</div>
          <ul className={styles.geogList}>
            {hoods.map((hood) => (
              <li key={hood.slug} className={styles.geogListItem}>
                <Link href={`/explore?geog=${hood.slug}`}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overlapLink}
                  >
                    {hood.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!munis && !!munis.length && (
        <div>
          <div className={styles.overlapTitle}>Overlapping Towns/Cities</div>
          <ul className={styles.geogList}>
            {munis.map((muni) => (
              <li key={muni.slug} className={styles.geogListItem}>
                <Link href={`/explore?geog=${muni.slug}`}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overlapLink}
                  >
                    {muni.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const selectedGeogLevel: Set<React.Key> = new Set([GeographyType.Tract]);

export default ReachPage;
