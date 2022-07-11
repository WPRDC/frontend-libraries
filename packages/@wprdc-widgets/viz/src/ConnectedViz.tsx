/**
 *
 * Viz
 *
 * Visualizes data
 *
 */
import * as React from 'react';
import './main.css';

import { ConnectedVizWidgetProps } from '@wprdc-types/viz';
import { useProvider } from '@wprdc-components/provider';
import { useIndicator } from '@wprdc-connections/profiles';
import { ErrorMessage } from '@wprdc-components/error-message';
import { Viz } from './Viz';
import { LoadingMessage } from '@wprdc-components/loading-message';

export const ConnectedViz: React.FC<ConnectedVizWidgetProps> = ({
  indicatorSlug,
  geog: propsGeog,
  acrossGeogs,
  ...indicatorProps
}) => {
  const { geog } = useProvider();
  const { slug: geogSlug } = React.useMemo(() => propsGeog || geog, [
    geog,
    propsGeog,
  ]);
  const { data: indicator, isLoading, error } = useIndicator(
    indicatorSlug,
    geogSlug,
    acrossGeogs
  );

  if (!!error) {
    return (
      <ErrorMessage
        variant="centered"
        title={`Error`}
        message={error.message}
      />
    );
  }
  if (isLoading) {
    return <LoadingMessage />;
  }
  if (!!indicator) {
    return <Viz indicator={indicator} {...indicatorProps} />;
  }
  return null;
};
