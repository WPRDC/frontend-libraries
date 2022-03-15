import * as React from 'react';
import {
  SearchBox,
  ConnectedSearchBox,
} from '../packages/@wprdc-components/search-box';
import { ResourceOptionTemplateOptions } from '../packages/@wprdc-types/list-box';
import { ProjectIndex } from '@wprdc-types/housecat';
import {
  affordableHousingProjectConnection,
  defaultAffordableHousingListBoxProps,
  usePublicHousingProject,
} from '../packages/@wprdc-connections/housecat';
import { AHProjectView } from '@wprdc-widgets/ah-project-view';

export default {
  title: 'Tools/Housing Projects Viewer',
  component: SearchBox,
};

export const AffordableHousingProjects = () => {
  const [project, setProject] = React.useState<ProjectIndex>();

  const { affordableHousingProject } = usePublicHousingProject(project);

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
      {!!affordableHousingProject && (
        <AHProjectView project={affordableHousingProject} />
      )}
    </div>
  );
};
