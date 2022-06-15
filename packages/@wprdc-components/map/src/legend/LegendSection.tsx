import * as React from 'react';

export interface LegendSectionProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const LegendSection: React.FC<LegendSectionProps> = ({
  title,
  children,
}) => {
  return (
    <>
      <p>{title}</p>
      <div>{children}</div>
    </>
  );
};
