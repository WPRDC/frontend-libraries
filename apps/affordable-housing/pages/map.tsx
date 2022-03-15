/**
 *
 * MapPage
 *
 */
import * as React from 'react';
import { MapFilterForm } from '../parts/MapFilterForm';
import { MapInterface } from '../parts/MapInterface';

import styles from '../styles/Map.module.css';
import { Item, Tabs } from '@wprdc/toolkit';
import { FilterFormValues } from '../types';
import { usePublicHousingProject } from '@wprdc-connections/housecat';
import { AHProjectView } from '@wprdc-widgets/ah-project-view';

interface Props {}

function MapPage(props: Props) {
  const [filterParams, setFilterParams] = React.useState<FilterFormValues>();
  const [currentProject, setCurrentProject] = React.useState<number>();

  const { affordableHousingProject } = usePublicHousingProject(currentProject);

  function handleFormChange(params: FilterFormValues) {
    setFilterParams(params);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuSection}>
        <Tabs aria-label="menu sections">
          <Item title="Filter">
            <MapFilterForm onSubmit={handleFormChange} />
          </Item>
          <Item title="Layer">TBD</Item>
        </Tabs>
      </div>
      <div className={styles.mapSection}>
        <MapInterface
          filterParams={filterParams}
          handleProjectSelection={setCurrentProject}
        />
      </div>
      <div className={styles.dashboardSection}>
        {!!affordableHousingProject && (
          <AHProjectView project={affordableHousingProject} />
        )}
      </div>
    </div>
  );
}

export default MapPage;
