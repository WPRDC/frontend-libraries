import * as React from 'react';
import './main.css';
import styles from './Table.module.css';

import { DataTableProps } from '@wprdc-types/viz';

/**
 * Renders a table of data.
 * @constructor
 */
export function FlatTable(props: DataTableProps) {
  const { indicator } = props;
  const { data, timeAxis, variables } = indicator;
  const { useDenominators } = indicator.options;
  return (
    <table className={styles.flatWrapper}>
      <thead>
        <tr>
          <th scope="col">Indicator</th>
          <td></td>
          {timeAxis.timeParts.map(timePart => (
            <th scope="col">{timePart.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {variables.map((variable, i) => [
          <tr>
            <th
              scope="row"
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
            {timeAxis.timeParts.map((_, k) => (
              <td>
                {data[0][k][i].value.toLocaleString(
                  'en-US',
                  variable.numberFormatOptions
                )}
              </td>
            ))}
          </tr>,
          useDenominators &&
            !!variable.denominators &&
            !!variable.denominators.length && (
              <tr className={styles.subrow}>
                <td>
                  <abbr title={variable.denominators[0].percentLabel}>%</abbr>
                </td>
                {timeAxis.timeParts.map((_, k) => (
                  <td>
                    {data[0][k][i].percent?.toLocaleString('en-us', {
                      style: 'percent',
                    })}
                  </td>
                ))}
              </tr>
            ),
        ])}
      </tbody>
    </table>
  );
}
