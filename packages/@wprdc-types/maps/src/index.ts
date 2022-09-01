import { LayerProps, LegendItemProps, SourceProps } from '@wprdc-types/map';

import { Package, Resource } from '@wprdc-types/ckan';

export interface MapLayer {
  /** identifies map layer unique to each layer */
  slug: string;

  /** name for the layer using menus, labels, etc. */
  name: string;

  /** description of what is shown by the layer */
  description: string;

  /** the type of geography being displayed by the layer */
  geogType: 'polygon' | 'point';

  /** the CKAN dataset  */
  dataset: Package;

  /** the ckan resource file */
  resource: Resource;

  /** mapbox source props */
  source: SourceProps;

  /** mapbox layer props */
  layers: LayerProps[];

  /** legend properties */
  legend?: LegendItemProps | LegendItemProps[];
}
