const { expandSignals } = require("../utils/backend");
module.exports = function (RED) {
  function SignalNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    /**
     * @type {import("../builder/builder").ConfBuilder}
     */
    const builder = this.context().flow.get("builder");

    /**
     * @type {}
     */
    node.on("input", function (msg) {
      // wires
      const wires = this.wires.flat();
      const json = config.SERIALIZED;
      const nodeConfig = JSON.parse(json);

      expandSignals(RED, nodeConfig, nodeConfig.props, []);

      builder.addNode(this.id, config.name, nodeConfig.values, wires);

      msg.payload.origin = this.nodetype;
      msg.payload.originId = this.id;
      msg.payload.trace.push(this.id);
      node.send(msg);
    });
  }

  RED.nodes.registerType("signal", SignalNode);
};
