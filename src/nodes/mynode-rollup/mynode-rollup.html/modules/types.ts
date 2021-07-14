import { EditorNodeProperties } from 'node-red';
import { MyNodeRollupOptions } from '../../shared/types';

export interface MyNodeRollupEditorNodeProperties
  extends EditorNodeProperties,
    MyNodeRollupOptions {}
