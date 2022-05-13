import * as React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../packages/@wprdc-components/button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: 'default',
  children: 'Press me',
  onPress: () => alert('Hey!'),
};

export const Dense = Template.bind({});
Dense.args = {
  children: 'Press me',
  dense: true,
};

export const Elevated = Template.bind({});
Elevated.args = {
  children: 'Press me',
  elevated: true,
};
