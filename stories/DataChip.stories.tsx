import * as React from 'react';
import { Story } from '@storybook/react';

import { DataChip } from '../packages/@wprdc-components/data-chip';

export default {
  title: 'Components/DataChip',
  component: DataChip,
  decorators: [
    (TheStory: Story) => (
      <div style={{ margin: '1em' }}>
        <TheStory />
      </div>
    ),
  ],
};

export const Default = () => (
  <div>
    <DataChip icon="map" value="3343 Forbes Ave" label="Address" />
    <br />
    <br />
    <DataChip icon="map" value="3343 Forbes Ave" label="Address" />
    <br />
    <br />
    <DataChip icon="map" value="3343 Forbes Ave" label="Address" size="S" />
    <br />
    <DataChip icon="map" value="3343 Forbes Ave" label="Address" size="M" />
    <br />
    <DataChip icon="map" value="3343 Forbes Ave" label="Address" size="L" />
  </div>
);
