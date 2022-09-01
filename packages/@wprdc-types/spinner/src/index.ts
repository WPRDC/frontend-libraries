/**
 *
 * Spinner types
 *
 **/
import { LoaderHeightWidthRadiusProps } from 'react-spinners/helpers/props';
import { SizeCategory } from '@wprdc-types/shared';

export interface SpinnerProps extends LoaderHeightWidthRadiusProps {
  size?: SizeCategory;
}
