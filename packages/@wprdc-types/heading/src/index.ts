/**
 *
 * Heading types
 *
 **/

export interface HeadingProps extends JSX.IntrinsicAttributes {
  level?: HeadingLevel;
  className?: string;
  children?: React.ReactNode;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
