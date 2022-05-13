import React from 'react';
import { Story } from '@storybook/react';

import { NumberField } from '@wprdc-components/number-field';
import { NumberFieldProps } from '@wprdc-types/number-field';

export default {
  title: 'Components/NumberField',
  component: NumberField,
};

const Template: Story<NumberFieldProps> = (args) => (
  <div style={{ width: '220px' }}>
    <NumberField {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  label: 'Enter a number',
};
