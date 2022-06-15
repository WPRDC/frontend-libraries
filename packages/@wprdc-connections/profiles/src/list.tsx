import * as React from 'react';

import { Item } from '@wprdc-components/util';

import { ListConnection, Resource } from '@wprdc-types/shared';
import { IndicatorBase, Topic, VariableBase } from '@wprdc-types/profiles';
import {
  ListBoxOptions,
  ResourceOptionTemplateOptions,
} from '@wprdc-types/list-box';
import { ResourceOptionTemplate } from '@wprdc-components/list-box';

import { RiFolderChartLine, RiLineChartLine } from 'react-icons/ri';

function makeProfilesConnection<T extends Resource>(
  itemType: string
): ListConnection<T> {
  return {
    async load({ signal, cursor, filterText }) {
      const res = await fetch(
        cursor ||
          `http://localhost:8000/${itemType}/?search=${filterText}&limit=10`,
        { signal }
      );
      const json = await res.json();

      return {
        items: json.results,
        cursor: json.next,
      };
    },
    renderItem: item => <Item key={item.id}>{item.name}</Item>,
    getKey: item => item.id.toString(),
  };
}

export const topicConnection: ListConnection<Topic> = makeProfilesConnection<
  Topic
>('topic');

/** style props */
export const defaultTopicListBoxProps: ListBoxOptions<
  Topic,
  ResourceOptionTemplateOptions<Topic>
> = {
  optionTemplate: ResourceOptionTemplate,
  optionTemplateOptions: {
    Icon: RiFolderChartLine,
    subtitleAccessor: 'description',
  },
};

export const indicatorConnection: ListConnection<IndicatorBase> = makeProfilesConnection<
  IndicatorBase
>('data-viz');

export const variableConnection: ListConnection<VariableBase> = makeProfilesConnection<
  VariableBase
>('variable');

export const defaultIndicatorListBoxProps: ListBoxOptions<
  IndicatorBase,
  ResourceOptionTemplateOptions<IndicatorBase>
> = {
  optionTemplate: ResourceOptionTemplate,
  optionTemplateOptions: {
    Icon: RiLineChartLine,
    subtitleAccessor: (item: IndicatorBase) => item.description,
  },
};
