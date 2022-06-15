import * as React from 'react';
import './main.css';
import styles from './Table.module.css';

import { DataTableProps } from '@wprdc-types/viz';

/**
 * Renders a table of data.
 * @constructor
 */
export function Table(props: DataTableProps) {
  const { indicator, useAbbreviations } = props;
  const { data, timeAxis, variables } = indicator;
  const { useDenominators } = indicator.options;
  return (
    <table className={styles.wrapper}>
      <thead>
        <tr>
          <td>&nbsp;</td>
          {timeAxis.timeParts.map(timePart => (
            <th scope="col">{timePart.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {variables.map((variable, i) => [
          <tr>
            <th scope="row">
              {!!useAbbreviations && !!variable.shortName ? (
                <abbr title={variable.name}>{variable.shortName}</abbr>
              ) : (
                variable.name
              )}
            </th>
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
                <th scope="row">{variable.denominators[0].percentLabel}</th>
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
