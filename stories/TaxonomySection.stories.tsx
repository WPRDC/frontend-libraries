import * as React from 'react';
import { useEffect, useState } from 'react';

import { useProvider } from '@wprdc-components/provider';

import { Indicator, Taxonomy } from '@wprdc-types/profiles';
import { DataVizID } from '@wprdc-types/viz';

import { ProfilesAPI, useTaxonomy } from '@wprdc-connections/profiles';

import { TaxonomySection } from '@wprdc-widgets/taxonomy-section';
import { useGeography } from '@wprdc-connections/geo';
import { GeogBrief, GeographyType } from '@wprdc-types/geo';

export default {
  title: 'Components/Taxonomy Section',
  component: TaxonomySection,
};

export const Default = () => {
  const [domainSlug, setDomainSlug] = useState<React.Key>('dev');
  const [subdomainSlug, _] = useState<React.Key>('dev');
  const [indicatorSlug, setIndicatorSlug] = useState<React.Key>();
  const [dataVizSlug, setDataVizSlug] = useState<React.Key>();
  const [geogBrief, setGeogBrief] = useState<GeogBrief>(DEFAULT_GEOG);

  const context = useProvider();
  const { geog } = useGeography(geogBrief && geogBrief.slug);

  const { taxonomy } = useTaxonomy('child-health-explorer');

  useEffect(() => {
    context.setGeog(geog);
  }, [geog]);

  function handleExploreIndicator(indicator: Indicator) {
    setIndicatorSlug(indicator.slug);
  }

  function handleExploreDataViz(dataViz: DataVizID) {
    setDataVizSlug(dataViz.slug);
  }

  return (
    <div>
      {!!taxonomy && (
        <TaxonomySection
          taxonomy={taxonomy}
          geog={context.geog}
          currentDomainSlug={domainSlug as string}
          currentDomainHref={'/#'}
          onTabsChange={setDomainSlug}
          currentSubdomainSlug={subdomainSlug as string}
          currentSubdomainHref={'/#'}
          currentIndicatorHref={'/#'}
          currentIndicatorSlug={indicatorSlug as string}
          currentDataVizHref={'/#'}
          currentDataVizSlug={dataVizSlug as string}
          onExploreIndicator={handleExploreIndicator}
          onExploreDataViz={handleExploreDataViz}
        />
      )}
    </div>
  );
};

const DEFAULT_GEOG: GeogBrief = {
  id: 104,
  slug: 'county-42003',
  name: 'Allegheny',
  title: 'Allegheny',
  geogType: GeographyType.County,
  geogID: '42003',
};
