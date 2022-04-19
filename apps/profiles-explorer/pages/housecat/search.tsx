import React from 'react';
import styles from '../../styles/housecat/Search.module.css';
import { ResourceOptionTemplateOptions } from '@wprdc-types/list-box';
import {
  affordableHousingProjectConnection,
  defaultAffordableHousingListBoxProps,
  usePublicHousingProject,
} from '@wprdc-connections/housecat';
import { ConnectedSearchBox } from '@wprdc-components/search-box';
import { AHProjectView } from '@wprdc-widgets/ah-project-view';
import { ProjectIndex } from '@wprdc-types/housecat';
import Layout from '../../components/Layout';
import { HousecatNavbar } from '../../components/Navbar';
import HousecatFooter from '../../components/Footer/HousecatFooter';

function SearchPage() {
  const [currentProject, setCurrentProject] = React.useState<ProjectIndex>();
  const { affordableHousingProject } = usePublicHousingProject(currentProject);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchSection}>
        <h2 className={styles.cta}>Find information on subsidized housing</h2>
        <ConnectedSearchBox<
          ProjectIndex,
          ResourceOptionTemplateOptions<ProjectIndex>
        >
          label="Search by project name"
          connection={affordableHousingProjectConnection}
          listBoxProps={defaultAffordableHousingListBoxProps}
          onSelection={setCurrentProject}
        />
      </div>
      <div className={styles.dataSection}>
        {!!affordableHousingProject && (
          <AHProjectView project={affordableHousingProject} />
        )}
      </div>
    </div>
  );
}

SearchPage.getLayout = function getLayout(page: React.ReactChildren) {
  return (
    <Layout Navbar={HousecatNavbar} Footer={HousecatFooter}>
      {page}
    </Layout>
  );
};

export default SearchPage;
