/*
 *
 * Source types
 *
 */
import { Resource, TagRecord } from '@wprdc-types/shared';
import { ContextItem } from './context';

export interface SourceBase extends Resource {
  infoLink: string;
  tags: TagRecord[];
  context: ContextItem[];
}

export interface CensusSource extends SourceBase {
  dataset: string;
}

export interface CensusVariableSource extends CensusSource {
  formula: string;
}

export interface CKANSource extends SourceBase {
  packageId: string;
  resourceId: string;
}

export interface CKANVariableSource extends CKANSource {
}

export type VariableSource = CensusVariableSource | CKANVariableSource;
