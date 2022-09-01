/**
 *
 * Heading
 *
 * Section heading
 *
 */
import * as React from 'react';
import './main.css';
import { HeadingProps } from '@wprdc-types/heading';

export const Heading: React.FC<HeadingProps> = ({ level, ...rest }) => {
  const HeadingElem: keyof JSX.IntrinsicElements = level
    ? (`h${level}` as keyof JSX.IntrinsicElements)
    : 'div';
  return <HeadingElem {...rest} />;
};
