import React from 'react';

import type { NextPage } from 'next';

import styles from '../../styles/Reach.module.css';

import { useRouter } from 'next/router';

import { ProjectKey } from '@wprdc-types/shared';
import { TaxonomySection } from '../../components/TaxonomySection';
import {
  ConnectedMapEventHandler,
  ConnectionCollection,
} from '@wprdc-types/connections';


const TAXONOMY_SLUG = 'affordable-housing'
const BASE_PATH = '/housing'

import { Geog, GeogBrief, GeogLevel, GeographyType } from '@wprdc-types/geo';
import { TopicBrief } from '@wprdc-types/profiles';
import { useTaxonomy } from '@wprdc-connections/profiles';
import { menuLayerConnection, useGeography } from '@wprdc-connections/geo';
import { serializeParams } from '@wprdc-connections/api';
import { useProvider } from '@wprdc-components/provider';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { Map } from '@wprdc-components/map';
import { LayerPanelVariant } from '@wprdc-types/map';
import { BreadcrumbLink } from '../../components/BreadcrumbLink';

const ReachPage: NextPage = () => {

  const [geogBrief, setGeogBrief] = React.useState<GeogBrief>(defaultGeogBrief);
  const [pathSlugs, setPathSlugs] = React.useState<string[]>([]);

  const context = useProvider();
  const router = useRouter();
  const { data: geog, isLoading, error } = useGeography(geogBrief.slug);
  const {
    data: taxonomy,
    isLoading: taxonomyIsLoading,
    error: taxonomyError,
  } = useTaxonomy('affordable-housing');

  function handleTabChange(domain: React.Key): void {
    router.push(
      `/housing/${domain}/${serializeParams(router.query)}`,
      undefined,
      {
        shallow: true,
      },
    );
  }
  function handleExploreTopic(topic: TopicBrief): void {
    const { slugs, ...sansSlugs } = router.query;

    if (!!topic.slug) {
      const dSlug = topic.hierarchies[TAXONOMY_SLUG][0].slug;
      const sdSLug = topic.hierarchies[TAXONOMY_SLUG][1].slug;

      router.push({
        pathname: `/housing/${dSlug}/${sdSLug}/${topic.slug}/`,
        query: sansSlugs,
      });
    }
  }
  const handleClick: ConnectedMapEventHandler = (_, __, toolboxItems) => {
    if (!!toolboxItems) {
      const clickedGeogs: GeogBrief[] | undefined =
        toolboxItems[ProjectKey.GeoMenu];
      if (!!clickedGeogs && !!clickedGeogs.length)
        setGeogBrief(clickedGeogs[0]);
    }
  };

  const [domainSlug, subdomainSlug, topicSlug] = pathSlugs;

  // update state when path updates
  React.useEffect(() => {
    if (!!router.query.slugs) {
      const slugs: string[] =
        typeof router.query.slugs === 'string'
          ? [router.query.slugs]
          : router.query.slugs;
      setPathSlugs(slugs);
    } else {
      setPathSlugs(['housing-market']);
    }
  }, [router.query.slugs]);

  React.useEffect(() => {
    if (!!geog) context.setGeog(geog);
  }, [geog]);


  return (
    <div className={styles.wrapper}>
      <div className={styles.subWrapper}>
        <div className={styles.main}>
          <div className={styles.intro}>
            <div className={styles.title}>
              <a href={BASE_PATH}>Housing Indicators</a>
            </div>
            <div className={styles.subtitle}>
              Indicators to inform affordable housing work
            </div>
            <div className={styles.description}>
              <p>
                This tool provides a wide range of contextual information related to housing characteristics and housing
                market conditions in Allegheny County. The data included here is compiled from a wide range of federal
                and
                local administrative and statistical data sources, including Census responses and estimates, sales data,
                property assessment records, data reported by mail carriers, court system filings, output from
                statistical
                models, and mortgage records. We also include health indicators that are closely tied to housing and
                other
                neighborhood conditions. This tool uses 2010 Census tract boundaries as our common unit of analysis.
              </p>
              <p>
                This data will be useful for residents looking to learn more about housing in their community. We also
                expect it will have value for people engaged in a housing search process. Housing and community
                development stakeholders and elected officials can also use this data to better-understand some of the
                local contexts important when designing policy and developing and administering programs.
              </p>
              <p>
                We drew heavily from the work of housing researcher Alan Mallach in deciding which indicators to create
                and include in this tool. We found his guides, including <a
                href={
                  'https://communityprogress.org/publication/neighborhoods-by-numbers-an-introduction-to-finding-and-using-small-area-data/'
                }>Neighborhoods
                by Numbers: An Introduction to
                Finding and Using Small Area Data</a>, and a chapter in a report he co-authored for the Federal Reserve
                Bank
                with Chris Walker titled <a
                href='https://www.federalreserve.gov/publications/putting-data-to-work-using-data.htm'>“Using Data to
                Address the Challenge of Irresponsible Investors in Neighborhoods”</a>
                especially valuable.
              </p>
            </div>
            <div className={styles.geoDetails}>
              {!!geog && (
                <div>
                  <div className={styles.geogTitle}>{geog.title}</div>
                </div>
              )}

              {!!geog && <GeogOverlapListing geog={geog} />}
            </div>
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
                },
              }}
            />
          </div>
        </div>


        {!taxonomyIsLoading && !!taxonomy && (
          <div className={styles.dashboard}>
            {!!taxonomyIsLoading && (
              <div className={styles.loader}>
                <LoadingMessage message='Loading dashboard...' />
              </div>
            )}

            {taxonomy && (
              <TaxonomySection
                basePath={BASE_PATH}
                taxonomy={taxonomy}
                geog={geog}

                currentDomainSlug={domainSlug}
                currentSubdomainSlug={subdomainSlug}
                currentTopicSlug={topicSlug}
                onExploreTopic={handleExploreTopic}
                onTabsChange={handleTabChange}
                breadcrumbLinkComponent={BreadcrumbLink}
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
    <div className={styles.overlapSection}>
      {!!hoods && !!hoods.length && (
        <div>
          <div className={styles.overlapTitle}>located in</div>
          <ul className={styles.geogList}>
            {hoods.map((hood) => (
              <li key={hood.slug} className={styles.geogListItem}>
                {hood.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!hoods?.length && !!munis && !!munis.length && (
        <div>
          <div className={styles.overlapTitle}>located in</div>
          <ul className={styles.geogList}>
            {munis.map((muni) => (
              <li key={muni.slug} className={styles.geogListItem}>
                {muni.name}
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
