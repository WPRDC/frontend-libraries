/*
 *
 * Variable types
 *
 */
import { Resource, TagRecord } from '@wprdc-types/shared';
import { ContextItem } from './context';
import { VariableSource } from './source';

export type Variable = VariableBase;

export interface VizVariable extends VariableBase {
  options: VizVariableOptions;
}

export interface VariableBase extends Resource {
  shortName?: string;
  displayName: string;
  units?: string;
  unitNotes?: string;
  denominators: VariableBase[];
  depth: number;
  percentLabel: string;
  sources: VariableSource[];
  numberFormatOptions?: Intl.NumberFormatOptions;
  resourcetype: VariableResourceType;
  tags: TagRecord[];
  context: ContextItem[];
}

type VizVariableOptions = Record<string, any>;

export enum VariableResourceType {
  CKANVariable = 'CKANVariable',
  CensusVariable = 'CensusVariable',
}
