/**
 *
 * DataDashboard
 *
 */
import * as React from 'react';
import { Tabs } from '@wprdc-components/tabs';
import { Item } from '@wprdc-components/util';

interface Props {}

export function DataDashboard(props: Props) {
  return (
    <Tabs aria-label="data viz sections">
      <Item title="Data in View">TBD</Item>
      <Item title="All Data">TBD</Item>
    </Tabs>
  );
}

const testData = {
  table: [
    { a: 'A', b: 28 },
    { a: 'B', b: 55 },
    { a: 'C', b: 43 },
    { a: 'D', b: 91 },
    { a: 'E', b: 81 },
    { a: 'F', b: 53 },
    { a: 'G', b: 19 },
    { a: 'H', b: 87 },
    { a: 'I', b: 52 },
  ],
};

const testData2 = {
  table: [
    { a: 'A', b: 0 },
    { a: 'B', b: 2 },
    { a: 'C', b: 3 },
    { a: 'D', b: 1 },
    { a: 'E', b: 1 },
    { a: 'F', b: 3 },
    { a: 'G', b: 9 },
    { a: 'H', b: 7 },
    { a: 'I', b: 2 },
  ],
};
