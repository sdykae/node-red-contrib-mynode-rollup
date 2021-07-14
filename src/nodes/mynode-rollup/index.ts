/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NodeInitializer, NodeDef, Node, NodeConstructor } from 'node-red';
import { MyNodeRollupNodeDef } from './modules/types';

const nodeInit: NodeInitializer = (RED): void => {
  const iotaStreams: NodeConstructor<
    Node,
    MyNodeRollupNodeDef,
    Record<string, never>
  > = function (config) {
    RED.nodes.createNode(this, config);
    const Node = RED.nodes.getNode(config.id);
    const opA = config.defOptA;
    const opB = config.defOptB;
    this.on('input', (msg, send, done) => {
      send(msg);
      if (done) {
        done();
      }
    });
  };

  RED.nodes.registerType('mynode-rollup', iotaStreams);
};

export = nodeInit;
