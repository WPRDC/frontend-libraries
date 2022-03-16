import React from 'react';

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Search.module.css';
import {
  affordableHousingProjectConnection,
  defaultAffordableHousingListBoxProps,
  usePublicHousingProject,
  AHProjectView,
  ProjectIndex,
  ResourceOptionTemplateOptions,
  ConnectedSearchBox,
} from '@wprdc/toolkit';

const SearchPage: NextPage = () => {
  const [currentProject, setCurrentProject] = React.useState<ProjectIndex>();
  const { affordableHousingProject } = usePublicHousingProject(currentProject);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchSection}>
        <h2 className={styles.cta}> Find information on affordable housing</h2>
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
};

export default SearchPage;
