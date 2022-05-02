import React from 'react';

import type { NextPage } from 'next';

import styles from '../../styles/Reach.module.css';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { ProjectKey } from '@wprdc-types/shared';
import { LayerPanelVariant } from '@wprdc-types/map';
import {
  ConnectedMapEventHandler,
  ConnectionCollection,
} from '@wprdc-types/connections';
import { TaxonomySection } from '@wprdc-widgets/taxonomy-section';
import { Geog, GeogBrief, GeogLevel, GeographyType } from '@wprdc-types/geo';
import { DataVizBase } from '@wprdc-types/viz';
import { Indicator } from '@wprdc-types/profiles';
import { useTaxonomy } from '@wprdc-connections/profiles';
import { menuLayerConnection, useGeography } from '@wprdc-connections/geo';
import { serializeParams } from '@wprdc-connections/api';
import { useProvider } from '@wprdc-components/provider';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { Map } from '@wprdc-widgets/map';

const ReachPage: NextPage = () => {
  const [geogBrief, setGeogBrief] = React.useState<GeogBrief>(defaultGeogBrief);
  const [pathSlugs, setPathSlugs] = React.useState<string[]>([]);

  const context = useProvider();
  const { geog, isLoading, error } = useGeography(geogBrief.slug);
  const router = useRouter();

  function handleTabChange(domain: React.Key): void {
    router.push(
      `/reach/${domain}/${serializeParams(router.query)}`,
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
  } = useTaxonomy('reach');

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
      `/reach/${domainSlug}/${subdomainSlug}/${indicatorSlug}/${
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
        `/reach/${domain}/${subdomain}/${indicator.slug}/${serializeParams(
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
              <a href="/reach">Community Data Explorer</a>
            </div>
            <div className={styles.subtitle}>
              Indicators to inform municipal equity practices
            </div>
            <p className={styles.description}>
              Municipal governments have a profound role and responsibility for
              leading the way to quality of life and equitable access to
              opportunity in the communities of our region. The University of
              Pittsburgh’s Graduate School of Public Health, Sustainable
              Pittsburgh, and the Western Pennsylvania Regional Data Center have
              collaboratively developed a set of tools that municipal
              governments in REACH communities can use to improve social equity
              and reduce health disparities. This Community Data Explorer shares
              metrics from existing data to capture structural and social
              factors among the REACH neighborhoods.
            </p>
          </div>
          <div className={styles.mapSection}>
            <Map
              initialViewState={{
                zoom: 9.5,
                longitude: -79.92,
                latitude: 40.37,
              }}
              layerPanelVariant={LayerPanelVariant.None}
              connections={[menuLayerConnection] as ConnectionCollection}
              onClick={handleClick}
              connectionHookArgs={{
                [ProjectKey.GeoMenu]: {
                  layerItems: geogLevels,
                  layerSelection: selectedGeogLevel,
                  options: {
                    highlightFilter: [
                      'in',
                      ['get', 'global_geoid'],
                      ['literal', REACH_TRACTS],
                    ],
                  },
                },
              }}
            />
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.geoDetails}>
            {!!geog && (
              <div>
                <div className={styles.geogTitle}>{geog.title}</div>
              </div>
            )}
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

const REACH_TRACTS = [
  '42003220600',
  '42003250300',
  '42003250900',
  '42003261400',
  '42003262000',
  '42003562700',
  '42003563200',
  '42003030500',
  '42003050100',
  '42003050900',
  '42003051100',
  '42003101600',
  '42003101700',
  '42003120300',
  '42003120400',
  '42003130100',
  '42003130200',
  '42003130300',
  '42003130400',
  '42003130600',
  '42003560600',
  '42003561000',
  '42003561100',
  '42003561200',
  '42003561500',
  '42003486700',
  '42003492700',
  '42003492800',
  '42003492900',
  '42003504100',
  '42003510000',
  '42003512800',
  '42003514000',
  '42003551200',
  '42003551900',
  '42003552000',
  '42003552100',
];

export default ReachPage;
