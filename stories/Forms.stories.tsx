import React from 'react';
import { Item } from '@wprdc-components/util';
import { NumberField } from '@wprdc-components/number-field';

import { TextField } from '@wprdc-components/text-field';
import { Select } from '@wprdc-components/select';
import { ConnectedSearchBox, SearchBox } from '@wprdc-components/search-box';
import { GeogBrief, GeographyType } from '@wprdc-types/geo';
import {
  defaultGeogListBoxProps,
  makeGeographyConnection,
} from '@wprdc-connections/geo';

export default {
  title: 'Components/Form',
};

export const Default = () => {
  return (
    <div style={{ width: '220px' }}>
      <NumberField label="Number field" />
      <TextField label="Text Field" />
      <Select label="Select">
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Item key="aardvark">Aardvark</Item>
        <Item key="kangaroo">Kangaroo</Item>
        <Item key="snake">Snake</Item>
      </Select>
      <ConnectedSearchBox<GeogBrief>
        label="Search for a county"
        connection={makeGeographyConnection(GeographyType.County)}
        listBoxProps={defaultGeogListBoxProps}
        onSelection={console.log}
      />
    </div>
  );
};
