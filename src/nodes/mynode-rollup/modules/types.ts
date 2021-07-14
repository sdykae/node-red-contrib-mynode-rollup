import { NodeDef } from 'node-red';
import { MyNodeRollupOptions } from '../shared/types';

export interface MyNodeRollupNodeDef extends NodeDef, MyNodeRollupOptions {}
