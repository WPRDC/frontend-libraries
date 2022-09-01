import * as React from 'react';
import { Story } from '@storybook/react';

import { Tooltip, TooltipText } from '../packages/@wprdc-components/tooltip';
import { TooltipProps } from '../packages/@wprdc-types/tooltip';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
};

const Template: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>click me, please</Tooltip>
);

export const Primary = Template.bind({});
Primary.args = {
  content: <div>Thanks!</div>,
};

export const Text = () => {
  return <TooltipText {...Primary.args}>Label Text</TooltipText>;
};
