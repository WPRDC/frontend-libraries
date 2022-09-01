/**
 *
 * GeographyPicker types
 *
 **/
import { GeogBrief } from '@wprdc-types/geo';
import { AriaFieldProps } from '@react-aria/label';

export interface GeographyPickerProps
  extends AriaFieldProps,
    GeographyPickerMenuProps {
}

export interface GeographyPickerMenuProps {
  variant?: 'default' | 'dialog' | 'popup';
  selectedGeog?: GeogBrief;
  onSelection?: (geog: GeogBrief) => any;
}

export interface GeographyPickerInputProps {
}
