import React, { useEffect } from 'react';
import { Story } from '@storybook/react';

import { TopicView } from '../packages/@wprdc-widgets/topic-view';
import { GeographyType } from '../packages/@wprdc-types/geo';
import { Topic } from '../packages/@wprdc-types/profiles';
import { ConnectedTopicViewProps } from '../packages/@wprdc-types/topic-view';
import { useProvider } from '../packages/@wprdc-components/provider';
import { ConnectedTopicView } from '../packages/@wprdc-widgets/topic-view';
import { useGeography } from '../packages/@wprdc-connections/geo';
import { GeogBrief } from '../packages/@wprdc-types/geo';
import { ConnectedSearchBox } from '../packages/@wprdc-components/search-box';
import {
  topicConnection,
  defaultTopicListBoxProps,
} from '../packages/@wprdc-connections/profiles';
import { Divider } from '../packages/@wprdc-components/divider';
import { GeographyPicker } from '@wprdc-widgets/geography-picker';

export default {
  title: 'Tools/Topic Viewer',
  component: TopicView,
};

const DEFAULT_GEOG: GeogBrief = {
  id: 104,
  slug: 'county-42003',
  name: 'Allegheny',
  title: 'Allegheny',
  geogType: GeographyType.County,
  geogID: '42003',
};

const GEOG_SLUG = 'tract-42003070300';

const ConnectedTemplate: Story<ConnectedTopicViewProps> = args => {
  const context = useProvider();
  const [topicSlug, setTopicSlug] = React.useState<string>('total-population');

  const { geog } = useGeography(GEOG_SLUG);

  useEffect(() => {
    if (!!geog) context.setGeog(geog);
  }, [geog]);

  function handleSelection(topic: Topic) {
    if (!!topic) setTopicSlug(topic.slug);
  }

  return (
    <>
      <ConnectedSearchBox
        connection={topicConnection}
        label="Pick your topic"
        onSelection={handleSelection}
        listBoxProps={defaultTopicListBoxProps}
      />
      <br />
      <br />
      <Divider weight="thick" />

      <ConnectedTopicView {...args} topicSlug={topicSlug} />
    </>
  );
};

const ComparisonTemplate: Story<ConnectedTopicViewProps> = args => {
  const [topicSlug, setTopicSlug] = React.useState<string>('total-population');
  const [geogBriefA, setGeogBriefA] = React.useState<GeogBrief>(DEFAULT_GEOG);
  const [geogBriefB, setGeogBriefB] = React.useState<GeogBrief>(DEFAULT_GEOG);

  const { geog: geogA } = useGeography(geogBriefA.slug);
  const { geog: geogB } = useGeography(geogBriefB.slug);

  function handleSelection(topic: Topic) {
    if (!!topic) setTopicSlug(topic.slug);
  }

  return (
    <>
      <ConnectedSearchBox
        connection={topicConnection}
        label="Pick your topic"
        onSelection={handleSelection}
        listBoxProps={defaultTopicListBoxProps}
      />
      <br />
      <br />
      <Divider weight="thick" />
      <div className="flex gap-4">
        <div className="basis-1/2 m-2">
          <GeographyPicker
            selectedGeog={geogBriefA}
            onSelection={setGeogBriefA}
          />
          <ConnectedTopicView
            {...args}
            geog={geogA}
            topicSlug={topicSlug}
            onGeogSelection={setGeogBriefA}
          />
        </div>
        <div className="basis-1/2 m-2">
          <GeographyPicker
            selectedGeog={geogBriefB}
            onSelection={setGeogBriefB}
          />
          <ConnectedTopicView
            {...args}
            geog={geogB}
            topicSlug={topicSlug}
            onGeogSelection={setGeogBriefB}
          />
        </div>
      </div>
    </>
  );
};

export const withSearch = ConnectedTemplate.bind({});
withSearch.args = {};

export const comparison = ComparisonTemplate.bind({});
withSearch.args = {};
