/**
 *
 * IndicatorView types
 *
 **/
import { Indicator } from '@wprdc-types/profiles';
import { GeogBrief } from '@wprdc-types/geo';
import { DataVizBase } from '@wprdc-types/viz';

export interface IndicatorViewProps {
  indicator?: Indicator;
  geog?: GeogBrief;
  onGeogSelection?: (geog: GeogBrief) => any;
  card?: boolean;
  isLoading?: boolean;
  onExploreIndicator?: (indicator: Indicator) => void;
  onExploreDataViz?: (dataViz: DataVizBase) => void;
  onCompareIndicator?: (indicator: Indicator) => void;
  showGeog?: boolean;
}

export interface ConnectedIndicatorViewProps
  extends Omit<IndicatorViewProps, 'indicator'> {
  indicatorSlug?: string;
}
