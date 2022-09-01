/*
 * Hover Popup
 *
 * Light-weight popup with minimal necessary information.
 */

import * as React from 'react';
import '../main.css';

import { ConnectedHoverPopupProps } from '@wprdc-types/connections';
import { Popup } from './Popup';

export const HoverPopup: React.FC<ConnectedHoverPopupProps> = ({
                                                                 latitude,
                                                                 longitude,
                                                                 onClose,
                                                                 children,
                                                                 connections,
                                                                 ...otherProps
                                                               }) => {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      onClose={onClose}
      {...otherProps}
    >
      <div className='bg-background p-1 rounded border border-gray-700'>
        {children}
      </div>
    </Popup>
  );
};

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

HoverPopup.defaultProps = {};
