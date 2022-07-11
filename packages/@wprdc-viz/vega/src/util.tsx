import * as React from 'react';
import { IndicatorWithData } from '@wprdc-types/profiles';
import { ChartRecord } from '@wprdc-types/viz';

export function useFilters(
  selectedVariables?: string[],
  selectedTimeParts?: string[]
) {
  const [renderVariables, setRenderVariables] = React.useState<Set<string>>(
    new Set()
  );
  const [renderTimeParts, setRenderTimeParts] = React.useState<Set<string>>(
    new Set()
  );

  React.useEffect(() => {
    setRenderVariables(new Set(selectedVariables));
    setRenderTimeParts(new Set(selectedTimeParts));
  }, [selectedVariables, selectedTimeParts]);

  return { renderTimeParts, renderVariables };
}

export function flattenData(
  indicator: IndicatorWithData,
  renderTimeParts: Set<string>,
  renderVariables: Set<string>
) {
  let result: ChartRecord[] = [];

  const { geog, time, vars } = indicator.dimensions;
  const { variables, timeAxis, geogs } = indicator;

  const totals = new Set(variables.filter(v => v.total).map(v => v.slug));

  for (let g = 0; g < geog.length; g++) {
    for (let t = 0; t < time.length; t++) {
      if (renderTimeParts.has(time[t]))
        for (let v = 0; v < vars.length; v++) {
          if (renderVariables.has(vars[v]) && !totals.has(vars[v]))
            result.push({
              geog: geog[g],
              time: time[t],
              variable: vars[v],
              variableLabel: variables[v].name,
              variableAbbr: variables[v].shortName,
              timeLabel: timeAxis.timeParts[t].name,
              geogLabel: geogs[g].name,
              ...indicator.data[g][t][v],
            });
        }
    }
  }
  return result;
}
