import React from 'react';

import type { NextPage } from 'next';

import styles from '../../styles/Reach.module.css';

import { useRouter } from 'next/router';

import { ProjectKey } from '@wprdc-types/shared';
import { TaxonomySection } from '../../components/TaxonomySection';
import { ConnectedMapEventHandler, ConnectionCollection } from '@wprdc-types/connections';
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


const TAXONOMY_SLUG = 'state-of-aging';
const BASE_PATH = '/state-of-aging';

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
  } = useTaxonomy(TAXONOMY_SLUG);

  function handleTabChange(domain: React.Key): void {
    router.push(
      `${BASE_PATH}${domain}/${serializeParams(router.query)}`,
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
        pathname: `${BASE_PATH}/${dSlug}/${sdSLug}/${topic.slug}/`,
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
      setPathSlugs(['state-of-aging-demographics']);
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
              <a href={BASE_PATH}>Just a Number</a>
            </div>
            <div className={styles.subtitle}>
              Community topics related to the state of aging
            </div>
            <div className={styles.description}>
              <p>
                We&apos;ll put a description of this tool here as well as one for the
                survey itself. We&apos;ll flood this with links to UCSUR/Pitt sites,
                the report on the state of aging, the data released, and whatever
                else we&apos;ll need.
              </p>
              <p>
                Another paragraph of description. Ubi est audax vortex? Pius,
                neuter domuss solite imperium de alter, rusticus byssus. gluten de
                talis equiso, resuscitabo turpis! fortis, teres vitas cito fallere
                de fatalis, brevis nix. speciess sunt mortems de velox fluctui.
              </p>
              <p>
                <strong>
                  Click on the map to see topics for other tracts.{' '}
                </strong>
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
