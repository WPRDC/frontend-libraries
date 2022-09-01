/**
 *
 * CheckboxGroup types
 *
 **/
import { AriaCheckboxGroupItemProps, AriaCheckboxGroupProps } from '@react-types/checkbox';
import { ReactElement } from 'react';

export interface CheckboxGroupProps extends AriaCheckboxGroupProps {
  items?: CheckboxProps[];
  children: ReactElement<CheckboxProps> | ReactElement<CheckboxProps>[];
}

export interface CheckboxProps extends AriaCheckboxGroupItemProps {
  label?: string;
}
