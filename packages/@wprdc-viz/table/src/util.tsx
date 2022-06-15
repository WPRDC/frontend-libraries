import React from 'react';
import { AxisItem, AxisOption, DownloadedTableViz } from '@wprdc-types/viz';

/**
 * Extracts title  from `Variable` and formats it.
 * @param {AxisItem} axisItem
 */
export function extractAndFormatLabel<T extends AxisItem>(
  axisItem: T
): React.ReactNode {
  const dashes = Array(axisItem.depth).join('-');
  let category;
  if (!!axisItem.shortName)
    category = <abbr title={axisItem.name}>{axisItem.shortName}</abbr>;
  else category = axisItem.name;
  return (
    <p>
      {!!dashes && `${dashes} `}
      {category}
    </p>
  );
}

export function extractAxes(indicator: DownloadedTableViz) {
  const { geogs, timeAxis, variables, options } = indicator;
  const columnAxisKey: AxisOption = options.columnAxis;
  const rowAxisKey: AxisOption = options.rowAxis;
  const viewAxisKey: AxisOption = options.columnAxis;

  const axisLookup: Record<AxisOption, AxisItem[]> = {
    [AxisOption.Geography]: geogs,
    [AxisOption.Time]: timeAxis.timeParts,
    [AxisOption.Variable]: variables,
  };

  const columnAxis: AxisItem[] = axisLookup[columnAxisKey];
  const rowAxis: AxisItem[] = axisLookup[rowAxisKey];
  const viewAxis: AxisItem[] = axisLookup[viewAxisKey];

  return {
    columnAxis,
    rowAxis,
    viewAxis,
  };
}
