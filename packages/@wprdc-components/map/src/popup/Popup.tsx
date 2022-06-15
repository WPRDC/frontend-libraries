/*
 * Popup
 *
 * A shim over the react-map-gl Popup, with some default settings applied.
 */

import * as React from 'react';
import '../main.css';
import { Popup as RMGPopup } from 'react-map-gl';
import { PopupProps } from '@wprdc-types/map';

export const Popup: React.FC<PopupProps> = ({
  latitude,
  longitude,
  onClose,
  children,
  ...otherProps
}) => {
  return (
    <RMGPopup
      latitude={latitude}
      longitude={longitude}
      closeOnClick={true}
      onClose={onClose}
      closeButton={false}
      anchor="bottom"
      {...otherProps}
    >
      {children}
    </RMGPopup>
  );
};

export default Popup;
