import * as React from 'react';

import { ConnectedTopicViewProps } from '@wprdc-types/topic-view';

import ErrorMessage from '@wprdc-components/error-message';
import { useProvider } from '@wprdc-components/provider';

import { useTopic } from '@wprdc-connections/profiles';

import { TopicView } from './TopicView';

export const ConnectedTopicView: React.FC<ConnectedTopicViewProps> = ({
  topicSlug,
  geog: propsGeog,
  ...otherProps
}) => {
  const { geog } = useProvider();
  const usedGeog = React.useMemo(() => propsGeog || geog, [geog, propsGeog]);
  const { data: topic, isLoading, error } = useTopic(topicSlug);

  if (!!error) {
    return <ErrorMessage title={`Not Found`} message="Indicator" />;
  }
  if (!!topic) {
    return (
      <TopicView
        topic={topic}
        geog={usedGeog}
        isLoading={isLoading}
        {...otherProps}
      />
    );
  }
  return <div />;
};
