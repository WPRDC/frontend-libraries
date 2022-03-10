import { DataVizType } from '@wprdc-types/shared';

import { TabularData, DataVizBase } from './common';

export interface ChartViz extends DataVizBase {
  data?: TabularData;
  vizType: DataVizType.BarChart;
}
