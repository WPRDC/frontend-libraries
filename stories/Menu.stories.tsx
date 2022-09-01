import * as React from 'react';
import { Menu } from '../packages/@wprdc-components/menu';
import { Item } from '../packages/@wprdc-components/util';

export default {
  title: 'Components/Menu',
  component: Menu,
};

export const Default = () => (
  <Menu>
    <Item>Thing 1</Item>
    <Item>Thing 2</Item>
  </Menu>
);
