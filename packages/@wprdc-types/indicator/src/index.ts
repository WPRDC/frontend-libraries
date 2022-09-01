/**
 *
 * TopicView types
 *
 **/
import { ErrorRecord, IndicatorBase, IndicatorWithData } from '@wprdc-types/profiles';
import { GeogBrief } from '@wprdc-types/geo';
import { ColorScheme } from '@wprdc-types/shared';

export interface IndicatorSharedProps {
  indicator?: IndicatorWithData;
  geog?: GeogBrief;
  isLoading?: boolean;
  error?: ErrorRecord;
  colorScheme?: ColorScheme;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  showGeog?: boolean;
  onGeogSelection?: (g: GeogBrief) => void;
}

export interface IndicatorWidgetProps extends IndicatorSharedProps {
  onExplore?: (indicator: IndicatorBase) => void;
}

export interface IndicatorDetailProps extends IndicatorSharedProps {
}

export interface IndicatorPreviewProps extends IndicatorSharedProps {
}

export interface IndicatorMiniProps extends IndicatorSharedProps {
}

export interface IndicatorCardProps extends IndicatorSharedProps {
  onExplore?: (indicator: IndicatorBase) => void;
}

export enum IndicatorFormat {
  Card,
  Details,
  Mini,
  Preview,
}

// todo: move these to their own @wprdc-types/viz
