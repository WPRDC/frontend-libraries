import { DataRecord, IndicatorWithData } from '@wprdc-types/profiles';
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
  selectedTimeParts?: string[];
  selectedVariables?: string[];
  onHover?: (datum: ChartRecord | {}) => void;
  hoveredRecord?: ChartRecord;
}

/** Props shared across all Vega vizes */
export interface VegaCommonProps extends DataVizCommonProps {}

// Specific viz props

export interface BigValueProps extends DataVizCommonProps {}

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
  onCompare?: (indicator: IndicatorWithData) => void;
}

export interface ConnectedVizWidgetProps
  extends Omit<VizWidgetProps, 'indicator'> {
  indicatorSlug: string;
  geog: GeogBrief;
  acrossGeogs?: boolean;
}

export interface ChartRecord extends DataRecord {
  geog: string;
  variable: string;
  time: string;

  variableLabel: string;
  variableAbbr?: string;
  timeLabel: string;
  geogLabel: string;
}
