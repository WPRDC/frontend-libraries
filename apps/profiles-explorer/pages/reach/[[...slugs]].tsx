import React from 'react';

import type { NextPage } from 'next';

import styles from '../../styles/Reach.module.css';

import { useRouter } from 'next/router';

import { ProjectKey } from '@wprdc-types/shared';
import { LayerPanelVariant } from '@wprdc-types/map';
import { ConnectedMapEventHandler, ConnectionCollection } from '@wprdc-types/connections';
import { TaxonomySection } from '../../components/TaxonomySection';
import { Geog, GeogBrief, GeogLevel, GeographyType } from '@wprdc-types/geo';
import { IndicatorBase, TopicBrief } from '@wprdc-types/profiles';
import { useTaxonomy } from '@wprdc-connections/profiles';
import { menuLayerConnection, useGeography } from '@wprdc-connections/geo';
import { serializeParams } from '@wprdc-connections/api';
import { useProvider } from '@wprdc-components/provider';
import { LoadingMessage } from '@wprdc-components/loading-message';
import { Map } from '@wprdc-components/map';

const ReachPage: NextPage = () => {
  const [geogBrief, setGeogBrief] = React.useState<GeogBrief>(defaultGeogBrief);
  const [pathSlugs, setPathSlugs] = React.useState<string[]>([]);

  const context = useProvider();
  const { data: geog } = useGeography(geogBrief.slug);
  const router = useRouter();

  function handleTabChange(domain: React.Key): void {
    const { slugs, ...params } = router.query;
    router.push(`/reach/${domain}/${serializeParams(params)}`, undefined, {
      shallow: true,
    });
  }

  const [domainSlug, topicSlug] = pathSlugs;

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
    data: taxonomy,
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


  function handleExploreTopic(topic: TopicBrief): void {
    const { slugs, ...params } = router.query;
    if (!!topic) {
      router.push(
        `/reach/${domainSlug}/${topic.slug}/${serializeParams(
          params,
        )}`,
      );
    }
  }

  function handleCompareTopic(topic?: TopicBrief): void {
    if (!!geog && topic) {
      router.push({
        pathname: `/explore/topic/compare`,
        query: { g1: geog.slug, g2: 'county-42003', i: topic.slug },
      });
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.intro}>
          <div className={styles.title}>
            <a href='/reach'>Community Data Explorer</a>
          </div>
          <div className={styles.subtitle}>
            Indicators to inform municipal equity practices
          </div>
          <div className={styles.description}>
            <p>
              Municipal governments have a profound role and responsibility for
              leading the way to quality of life and equitable access to
              opportunity in the communities of our region.{' '}
              <a href='https://publichealth.pitt.edu/'>
                The University of Pittsburgh’s Graduate School of Public Health
              </a>
              ,{' '}
              <a href='https://sustainablepittsburgh.org/'>
                Sustainable Pittsburgh
              </a>
              , and the{' '}
              <a href='http://www.wprdc.org'>
                Western Pennsylvania Regional Data Center
              </a>{' '}
              have collaboratively developed a set of tools that municipal
              governments in{' '}
              <a href='https://livewellallegheny.com/reach/'>REACH</a>{' '}
              communities can use to improve social equity and reduce health
              disparities.{' '}
            </p>

            <p>
              <a
                href='https://sustainablepittsburgh.org/wp-content/uploads/SustainablePA_MunicipalEquityToolkit_Feb16.pdf'>
                The Sustainable PA Municipal Equity Toolkit
              </a>{' '}
              is designed to be a resource for Pennsylvania’s local government
              staff and elected officials when considering, developing,
              implementing and/or administering equity measures.
            </p>

            <p>
              This Community Data Explorer shares metrics from existing data to
              capture structural and social factors among the{' '}
              <a href='https://livewellallegheny.com/reach/'>REACH</a>{' '}
              neighborhoods (Northside, Hill District, Garfield, Larimer,
              Homewood, East Hills, Wilkinsburg and Mon Valley).&nbsp;{' '}
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
              zoom: 9.8,
              longitude: -79.92,
              latitude: 40.37,
            }}
            interactiveLayerIds={['tract/fill']}
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

      <div className={styles.geoDetails}>
        {!!geog && (
          <div>
            <div className={styles.geogTitle}>{geog.title}</div>
          </div>
        )}
        {!!geog && <GeogOverlapListing geog={geog} />}
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
              basePath="/reach"
              taxonomy={taxonomy}
              geog={geog}
              currentDomainSlug={domainSlug}
              currentTopicSlug={topicSlug}
              onExploreTopic={handleExploreTopic}
              onCompareTopic={handleCompareTopic}
              onTabsChange={handleTabChange}
            />
          )}
        </div>
      )}
      <footer className={styles.footer}></footer>
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
