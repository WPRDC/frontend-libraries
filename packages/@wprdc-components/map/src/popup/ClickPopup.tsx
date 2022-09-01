/*
 * Hover Popup
 *
 * Light-weight popup with minimal necessary information.
 */

import * as React from 'react';

import '../main.css';

import { ConnectedClickPopupProps } from '@wprdc-types/connections';

import { Popup } from './Popup';

export const ClickPopup: React.FC<ConnectedClickPopupProps> = ({
                                                                 children,
                                                                 latitude,
                                                                 longitude,
                                                                 onClose,
                                                                 ...otherProps
                                                               }) => {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      onClose={onClose}
      {...otherProps}
    >
      <div className='bg-background rounded-sm border border-gray-700'>
        {children}
      </div>
    </Popup>
  );
};

ClickPopup.defaultProps = {};
