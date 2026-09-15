module.exports = function (RED) {
  function ConfigEndNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const builder = this.context().flow.get("builder");

    node.on("input", function (_msg) {
      const config = builder.getConfig();
      const filename = "villasconfig.json";

      RED.comms.publish("config-end/download", {
        filename: filename,
        content: config
      });

      node.status({
        fill: "green",
        shape: "dot",
        text: "Config " + filename + " sent to browser"
      });

      setTimeout(() => {
        node.status({});
      }, 5000);
    });
  }

  RED.nodes.registerType("config-end", ConfigEndNode);
};
