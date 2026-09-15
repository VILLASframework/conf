const { decomposeArrays, cleanProps } = require("../utils/backend");

module.exports = function (RED) {
  function RoundNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const builder = this.context().flow.get("builder");

    const hookConfig = {
      type: config.hooktype,
      signals: [],
      precision: config.precision,
    }

    const inputHandler = function (msg) {
      const wires = this.wires.flat();

      hookConfig.signals = []
      builder.addHook2(this.id, hookConfig, msg, wires);

      msg.payload = {
        ...msg.payload,
        origin: this.hooktype,
        originId: this.id,
        trace: [...(msg.payload.trace || []), this.id]
      };
      node.send(msg);
    };
    node.on("input", inputHandler);
  }
  RED.nodes.registerType("round", RoundNode);
};
