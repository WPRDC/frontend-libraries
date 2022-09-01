import { BreadcrumbItemLinkProps } from '@wprdc-types/breadcrumbs';
import Link from 'next/link';

export const BreadcrumbLink: React.FC<BreadcrumbItemLinkProps> = props => {
  return <Link {...props} shallow={true} />;
};
