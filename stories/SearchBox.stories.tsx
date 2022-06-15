import * as React from 'react';
import {
  SearchBox,
  ConnectedSearchBox,
} from '../packages/@wprdc-components/search-box';
import { topicConnection } from '../packages/@wprdc-connections/profiles';
import { ResourceOptionTemplateOptions } from '../packages/@wprdc-types/list-box';
import { GeogBrief, GeographyType } from '@wprdc-types/geo';
import {
  defaultGeogListBoxProps,
  makeGeographyConnection,
} from '@wprdc-connections/geo';
import { defaultVizListBoxProps } from '@wprdc-connections/viz';
import { ProjectIndex } from '@wprdc-types/housecat';
import {
  affordableHousingProjectConnection,
  defaultAffordableHousingListBoxProps,
} from '../packages/@wprdc-connections/housecat';
import { Topic } from '@wprdc-types/profiles';

export default {
  title: 'Components/SearchBox',
  component: SearchBox,
};

export const DataViz = () => {
  const [topic, setTopic] = React.useState<Topic>();
  const [geog, setGeog] = React.useState<GeogBrief>();
  return (
    <div>
      <ConnectedSearchBox<GeogBrief>
        connection={makeGeographyConnection(GeographyType.County)}
        listBoxProps={defaultGeogListBoxProps}
        onSelection={setGeog}
      />
      <pre>{JSON.stringify(geog, null, 2)}</pre>
      <br />
      <br />
      <div>
        <ConnectedSearchBox<Topic, ResourceOptionTemplateOptions<Topic>>
          connection={topicConnection}
          listBoxProps={defaultVizListBoxProps}
          onSelection={setTopic}
        />
      </div>
      <pre>{JSON.stringify(topic, null, 2)}</pre>
    </div>
  );
};

export const AffordableHousingProjects = () => {
  const [project, setProject] = React.useState<ProjectIndex>();

  return (
    <div>
      <ConnectedSearchBox<
        ProjectIndex,
        ResourceOptionTemplateOptions<ProjectIndex>
      >
        connection={affordableHousingProjectConnection}
        listBoxProps={defaultAffordableHousingListBoxProps}
        onSelection={setProject}
      />
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </div>
  );
};
