import * as React from 'react';
import { SectionSharedProps } from '@wprdc-types/taxonomy-section';
import { Indicator } from '@wprdc-types/profiles';
import { IndicatorView } from '@wprdc-widgets/indicator-view';

interface Props extends SectionSharedProps {
  indicator: Indicator;
}

export default function IndicatorSection({
  indicator,
  geog,
  onExploreDataViz,
  onExploreIndicator,
}: Props) {
  return (
    <IndicatorView
      card
      geog={geog}
      indicator={indicator}
      onExploreDataViz={onExploreDataViz}
      onExploreIndicator={onExploreIndicator}
    />
  );
}
