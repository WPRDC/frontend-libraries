import * as React from 'react';

import { Item } from '@wprdc-components/util';

import { DataVizID, VariableBase } from '@wprdc-types/viz';
import { Resource, ListConnection, DataVizType } from '@wprdc-types/shared';

import { ResourceOptionTemplate } from '@wprdc-components/list-box';

import {
  RiLineChartLine,
  RiMap2Line,
  RiFontSize,
  RiTableLine,
} from 'react-icons/ri';

import { TiSortNumerically } from 'react-icons/ti';
import {
  ListBoxOptions,
  ResourceOptionTemplateOptions,
} from '@wprdc-types/list-box';

function makeProfilesConnection<T extends Resource>(
  itemType: string
): ListConnection<T> {
  return {
    async load({ signal, cursor, filterText }) {
      const res = await fetch(
        cursor ||
          `https://api.profiles.wprdc.org/${itemType}/?search=${filterText}&limit=10`,
        { signal }
      );
      const json = await res.json();

      return {
        items: json.results,
        cursor: json.next,
      };
    },
    renderItem: (item) => {
      return <Item key={item.id}>{item.name}</Item>;
    },
    getKey: (item) => item.id.toString(),
  };
}

export const defaultVizListBoxProps: ListBoxOptions<
  DataVizID,
  ResourceOptionTemplateOptions<DataVizID>
> = {
  optionTemplate: ResourceOptionTemplate,
  optionTemplateOptions: {
    Icon: RiLineChartLine,
    getIcon: (item) => {
      switch (item.vizType) {
        case DataVizType.BarChart:
          return RiLineChartLine;
        case DataVizType.MiniMap:
          return RiMap2Line;
        case DataVizType.BigValue:
          return TiSortNumerically;
        case DataVizType.Sentence:
          return RiFontSize;
        case DataVizType.Table:
          return RiTableLine;
        default:
          return RiLineChartLine;
      }
    },
    subtitleAccessor: (item: DataVizID) => {
      switch (item.vizType) {
        case DataVizType.BarChart:
          return 'Chart';
        case DataVizType.MiniMap:
          return 'Map';
        case DataVizType.BigValue:
          return 'Value';
        case DataVizType.Sentence:
          return 'Narrative';
        case DataVizType.Table:
          return 'Table';
        default:
          return 'Data Viz';
      }
    },
  },
};

export const dataVizConnection: ListConnection<DataVizID> =
  makeProfilesConnection<DataVizID>('data-viz');

export const variableConnection: ListConnection<VariableBase> =
  makeProfilesConnection<VariableBase>('variable');
