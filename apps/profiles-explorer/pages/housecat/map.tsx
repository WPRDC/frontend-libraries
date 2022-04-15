/**
 *
 * MapPage
 *
 */
import * as React from 'react';
import { MapFilterForm } from '../../parts/MapFilterForm';
import { MapInterface } from '../../parts/MapInterface';

import styles from '../../styles/housecat/Map.module.css';
import { FilterFormValues } from '../../types';
import { usePublicHousingProject } from '@wprdc-connections/housecat';
import { AHProjectView } from '@wprdc-widgets/ah-project-view';
import { HousecatNavbar } from '../../components/Navbar';
import Layout from '../../components/Layout';

function MapPage() {
  const boardRef = React.useRef<HTMLDivElement>(null);

  const [filterParams, setFilterParams] = React.useState<FilterFormValues>();
  const [currentProject, setCurrentProject] = React.useState<number>();

  const { affordableHousingProject } = usePublicHousingProject(currentProject);

  function handleFormChange(params: FilterFormValues) {
    setFilterParams(params);
  }

  if (!!boardRef && boardRef.current) {
    boardRef.current.scrollTop = 0;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuSection}>
        <h2 className={styles.filterTitle}>Filter</h2>
        <MapFilterForm onSubmit={handleFormChange} />
      </div>
      <div className={styles.mapSection}>
        <MapInterface
          filterParams={filterParams}
          handleProjectSelection={setCurrentProject}
        />
      </div>
      <div ref={boardRef} className={styles.dashboardSection}>
        {!!affordableHousingProject ? (
          <AHProjectView project={affordableHousingProject} />
        ) : (
          <div className={styles.infoSection}>
            <h2 className={styles.infoTitle}>
              Find information on affordable housing
            </h2>
            <p className={styles.infoText}>
              Filter the data or zoom the map to locate the affordable housing
              project you are interested in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

MapPage.getLayout = function getLayout(page: React.ReactChildren) {
  return <Layout Navbar={HousecatNavbar}>{page}</Layout>;
};

export default MapPage;
