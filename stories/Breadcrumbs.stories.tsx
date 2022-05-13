import * as React from 'react';
import { Story } from '@storybook/react';

import {
  BreadcrumbItem,
  Breadcrumbs,
} from '../packages/@wprdc-components/breadcrumbs';
import { BreadcrumbsProps } from '../packages/@wprdc-types/breadcrumbs';

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
};

const Template: Story<BreadcrumbsProps<string>> = (args) => (
  <Breadcrumbs {...args} />
);

export const Default = Template.bind({});
Default.args = {
  showCurrent: true,
  children: [
    <BreadcrumbItem isDisabled href={'#'}>
      Test
    </BreadcrumbItem>,
    <BreadcrumbItem href={'#'}>Thingamabob</BreadcrumbItem>,
    <BreadcrumbItem href={'#'}>Another one</BreadcrumbItem>,
  ],
};
