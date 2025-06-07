const { decomposeArrays, cleanProps } = require("../utils/backend");

module.exports = function (RED) {
  function DumpNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const builder = this.context().flow.get("builder");

    const inputHandler = function (msg) {
      const wires = this.wires.flat();

      let parsed = decomposeArrays(config);
      let cleaned = cleanProps(parsed);

      builder.addHook(this.id, cleaned, wires);

      msg.payload.origin = this.hooktype;
      msg.payload.originId = this.id;
      msg.payload.trace.push(this.id);
      node.send(msg);
    };

    node.on("input", inputHandler);
  }

  RED.nodes.registerType("dump", DumpNode);
};
