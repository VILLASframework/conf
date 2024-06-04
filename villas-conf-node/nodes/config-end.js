module.exports = function (RED) {
  function ConfigEndNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    /**
     * @type {import("../builder/builder").ConfBuilder}
     */
    const builder = this.context().flow.get("builder");

    /**
     * @param {impot("../typedefs").Message} _msg
     */
    const inputHandler = function (_msg) {
      // TODO: save to file and propt user to download it.

      console.log(" #### BUILDER DEBUG PRINT ### ");
      builder.print();
    };
    node.on("input", inputHandler);
  }

  RED.nodes.registerType("config-end", ConfigEndNode);
};
