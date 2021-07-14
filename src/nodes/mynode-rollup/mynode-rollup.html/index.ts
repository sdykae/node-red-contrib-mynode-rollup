import { EditorRED } from 'node-red';
import { MyNodeRollupEditorNodeProperties } from './modules/types';
declare const RED: EditorRED;

RED.nodes.registerType<MyNodeRollupEditorNodeProperties>('mynode-rollup', {
  category: 'function',
  color: '#a6bbcf',
  defaults: {
    defOptA: { value: '' },
    defOptB: { value: 230 },
  },
  inputs: 1,
  outputs: 1,
  icon: 'transform-text.png',
  paletteLabel: 'transform text',
  label: function () {
    if (this.name) {
      return this.name;
    }
    return 'to upper case';
  },
});
