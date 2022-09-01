import { AriaTextFieldOptions } from '@react-aria/textfield';

export interface TextFieldBaseProps {
}

export type TextFieldProps<T extends 'input' | 'textarea' = 'input'> =
  AriaTextFieldOptions<T> & TextFieldBaseProps;
