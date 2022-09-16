/**
 *
 * Button types
 *
 **/
import { AriaButtonProps } from '@react-types/button';

export interface ButtonProps extends AriaButtonProps {
  color?: 'default' | 'primary' | 'secondary' | 'none';
  elevated?: boolean;
  dense?: boolean;
  className?: string;
}
