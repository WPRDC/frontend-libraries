/**
 *
 * TopicView types
 *
 **/
import { Topic, TopicBrief } from '@wprdc-types/profiles';
import { GeogBrief } from '@wprdc-types/geo';

export interface TopicViewProps {
  topic?: TopicBrief;
  geog?: GeogBrief;
  onGeogSelection?: (geog: GeogBrief) => any;
  card?: boolean;
  isLoading?: boolean;
  onExploreTopic?: (topic: TopicBrief) => void;
  onCompareTopic?: (topic: TopicBrief) => void;
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
}

export interface TopicDetailViewProps
  extends Omit<TopicViewProps, 'topic' | 'onExploreTopic' | 'card'> {
  topic?: Topic;
}

export interface ConnectedTopicViewProps extends Omit<TopicViewProps, 'topic'> {
  topicSlug?: string;
}
