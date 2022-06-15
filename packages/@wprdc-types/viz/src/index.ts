import { IndicatorWithData } from '@wprdc-types/profiles';
import { GeogBrief } from '@wprdc-types/geo';

export enum VizType {
  BigValue = 'BigValue',
  BarChart = 'BarChart',
}

/** Props shared across all data vizes */
export interface DataVizCommonProps {
  /** The indicator with data to be visualized. */
  indicator: IndicatorWithData;
  inPreview?: boolean;
}

export interface BigValueProps extends DataVizCommonProps {}

export interface VegaCommonProps extends DataVizCommonProps {}

export interface BarChartProps extends VegaCommonProps {}

export interface DataMapProps extends DataVizCommonProps {}

export interface DataTableProps extends DataVizCommonProps {
  useAbbreviations?: boolean;
}

export interface VizWidgetProps extends DataVizCommonProps {
  /** If true, the smallest possible viz will be used. */
  mini?: boolean;
  /** If true, all possible vizes will be displayed in at once */
  coplanar?: boolean;
}

export interface ConnectedVizWidgetProps
  extends Omit<VizWidgetProps, 'indicator'> {
  indicatorSlug: string;
  geog: GeogBrief;
}
