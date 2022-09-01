import * as React from 'react';
import { Story } from '@storybook/react';

import { Heading } from '../packages/@wprdc-components/heading';
import { HeadingProps } from '../packages/@wprdc-types/heading';

export default {
  title: 'Components/Heading',
  component: Heading,
};

const Template: Story<HeadingProps> = (args) => <Heading {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  level: 1,
  children: 'Heading',
};

export const Sizes = () => {
  return (
    <div>
      <Heading level={1}>Level 1</Heading>
      <Heading level={2}>Level 2</Heading>
      <Heading level={3}>Level 3</Heading>
      <Heading level={4}>Level 4</Heading>
      <Heading level={5}>Level 5</Heading>
      <Heading level={6}>Level 6</Heading>
    </div>
  );
};
