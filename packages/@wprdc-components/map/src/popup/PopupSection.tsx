import * as React from 'react';
import '../main.css';

import { PopupSectionProps } from '@wprdc-types/map';

export const PopupSection: React.FC<PopupSectionProps> = (props) => {
  const { label, icon, children } = props;
  return (
    <div>
      <SectionHeading label={label} icon={icon} />
      <div className="ml-2 mb-1">{children}</div>
    </div>
  );
};

interface SectionHeadingProps {
  label: string;
  icon?: (props: any) => JSX.Element;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  icon: Icon,
}) => (
  <div className="text-gray-500 leading-none">
    {!!Icon && <Icon className="h-5 inline-block" />}
    <div className="text-xs leading-none inline-block">{label}</div>
  </div>
);
