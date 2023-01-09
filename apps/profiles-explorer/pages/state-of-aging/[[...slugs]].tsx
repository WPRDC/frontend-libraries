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

const SoAPage: NextPage = () => {

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
              <a href={BASE_PATH}>Age-Friendly Community Index</a>
            </div>
            <div className={styles.description}>
              <p>Census Tracts are small statistical subdivisions of a county defined by the U.S. Census and average
                about 4,000 inhabitants. These areas are commonly used as a surrogate for the neighborhood environment
                in studies of health and environmental exposure. While they provide a relatively precise level of
                geographic detail, we realize that most people do not know what Census Tract they reside in. Because
                each Census Tract can be associated with a specific neighborhood or municipality, all indicators include
                both Census Tract and the associated neighborhood/municipality.</p>
              <p>The data are organized using a framework of five Domains including 1) Physical Environment; 2)
                Transport; 3) Housing; 4) Social Engagement; and 5) Community Services. Each Domain is first
                characterized using a percentile ranking of spatial indicator variables. Individual indicator rankings
                are summed to get Domain rankings which are then merged to generate an overall Age-Friendly Community
                Index. The measures are designed to allow direct comparison of census tracts for each individual AFC
                indicator, Domain, and Age-Friendly Community Index across the county. This enables the user to assess
                not just overall age-friendliness but also the relative contribution of each indicator and Domain to the
                AFC Index, identifying areas of strength and weakness regardless of AFC status.</p>
              <p>We hope that users of the data, including policy makers, service providers, community members and other
                stakeholders will utilize these rankings to focus on policy, services, and other interventions designed
                to improve not only the age-friendliness of their communities, but the quality of life of all
                residents.</p>
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

export default SoAPage;
