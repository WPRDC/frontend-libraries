import * as React from 'react';
import './main.css';
import styles from './Table.module.css';

import { DataTableProps } from '@wprdc-types/viz';

/**
 * Renders a table of data.
 * @constructor
 */
export function FlatTable(props: DataTableProps) {
  const { indicator, selectedTimeParts, selectedVariables } = props;
  const { data, timeAxis, variables } = indicator;
  const { useDenominators } = indicator.options;

  const renderVariables = React.useMemo(() => new Set(selectedVariables), [
    selectedVariables,
  ]);

  const renderTimeParts = React.useMemo(() => new Set(selectedTimeParts), [
    selectedTimeParts,
  ]);

  return (
    <table className={styles.flatWrapper}>
      <thead>
      <tr>
        <th scope='col'>{''}</th>
        <td></td>
        {timeAxis.timeParts.map(timePart => (
          <th key={timePart.slug} scope='col'>
            {timePart.name}
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {variables.map((variable, i) => {
        if (!renderVariables.has(variable.slug)) return null;
        return [
          <tr key={variable.slug}>
            <th
              scope='row'
              rowSpan={
                useDenominators &&
                !!variable.denominators &&
                !!variable.denominators.length
                  ? 2
                  : 1
              }
            >
              {variable.name}
            </th>
            <td>n</td>
            {timeAxis.timeParts.map((tp, k) => {
              if (!renderTimeParts.has(tp.slug)) return null;
              return (
                <td key={tp.slug}>
                  {data[0][k][i].value.toLocaleString(
                    'en-US',
                    variable.numberFormatOptions,
                  )}
                </td>
              );
            })}
          </tr>,
          useDenominators &&
          !!variable.denominators &&
          !!variable.denominators.length && (
            <tr className={styles.subrow} key={`${variable.slug}-subrow`}>
              <td>
                <abbr title={variable.denominators[0].percentLabel}>%</abbr>
              </td>
              {timeAxis.timeParts.map((tp, k) => {
                if (!renderTimeParts.has(tp.slug)) return null;

                return (
                  <td key={tp.slug}>
                    {data[0][k][i].percent?.toLocaleString('en-us', {
                      style: 'percent',
                    })}
                  </td>
                );
              })}
            </tr>
          ),
        ];
      })}
      </tbody>
    </table>
  );
}
