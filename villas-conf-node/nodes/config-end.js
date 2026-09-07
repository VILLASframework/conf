const fs = require("fs");

FILEPATH = "/tmp/villasconfig.json";

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
    node.on("input", function (_msg) {
      config = builder.getConfig();

      fs.writeFile(FILEPATH, config, (err) => {
        if (err) {
          console.error("Error writing config file:", err);
        }

      node.status({
        fill: "green",
        shape: "dot",
        text: "Config written to " + FILEPATH });
    });

      //builder.print();
    });
  }

  RED.nodes.registerType("config-end", ConfigEndNode);
};
