module.exports = function (RED) {
  function RoundNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    /**
     * @type {import("../builder/builder").ConfBuilder}
     */
    const builder = this.context().flow.get("builder");

    // Create one ConfigurationBuilder instance

    /**
     * @param {import("../typedefs").Message} msg
     * @return {import("../typedefs").Message}
     */
    const inputHandler = function (msg) {
      const wires = this.wires.flat();

      console.log("HOOK WIRES: ", wires);
      //builder.addHook(this.id, { test: 2 }, wires);

      msg.payload.origin = this.hooktype;
      msg.payload.originId = this.id;
      msg.payload.trace.push(this.id);
      node.send(msg);
    };
    node.on("input", inputHandler);
  }
  RED.nodes.registerType("round", RoundNode);
};
