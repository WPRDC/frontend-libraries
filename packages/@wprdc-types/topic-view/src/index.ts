/**
 *
 * TopicView types
 *
 **/
import { IndicatorWithData, Topic, TopicBrief } from '@wprdc-types/profiles';
import { GeogBrief } from '@wprdc-types/geo';

export interface TopicViewProps {
  topic?: TopicBrief;
  geog?: GeogBrief;
  onGeogSelection?: (geog: GeogBrief) => any;
  card?: boolean;
  isLoading?: boolean;
  onExploreTopic?: (topic: TopicBrief) => void;
  onCompareIndicator?: (indicator: IndicatorWithData) => void;
  showGeog?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  abortController?: AbortController;
}

export interface TopicViewCardProps {
  topicBrief?: TopicBrief;
  topic?: Topic;
  geog?: GeogBrief;
  onExploreTopic?: (topic: TopicBrief) => void;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  isLoading?: boolean;
  onCompareIndicator?: (indicator: IndicatorWithData) => void;
}

export interface TopicDetailViewProps
  extends Omit<TopicViewProps, 'topic' | 'onExploreTopic' | 'card'> {
  topic?: Topic;
  onCompareIndicator?: (indicator: IndicatorWithData) => void;
}

export interface ConnectedTopicViewProps extends Omit<TopicViewProps, 'topic'> {
  topicSlug?: string;
}
