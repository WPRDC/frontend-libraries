/**
 *
 * RadioGroup types
 *
 **/
import { RadioGroupProps as RSRadioGroupProps, RadioProps as RSRadioProps } from '@react-types/radio';
import { ReactElement } from 'react';

export interface RadioGroupProps extends RSRadioGroupProps {
  children: ReactElement<RadioProps> | ReactElement<RadioProps>[];
}

export interface RadioProps extends RSRadioProps {
}
