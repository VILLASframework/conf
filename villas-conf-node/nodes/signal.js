const { cleanProps } = require("../utils/backend");

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
      let parsedConfig = {
        ...config,
      };

      //parse arrays
      for (const propName in config) {
        if (/^.+Encoded$/.test(propName)) {
          const parsedPropName = propName.slice(
            0,
            propName.length - "Encoded".length,
          );
          console.log("Parsing", propName, " INTO ", parsedPropName);
          const parsed = JSON.parse(config[propName]);
          console.log("PARSED ", parsed);
          if (parsed.type === "INPUT") {
            parsedConfig[parsedPropName] = parsed.values;
          } else {
            const filtered = parsed.values.filter((x) => x !== "_ADD_");
            parsedConfig[parsedPropName] = filtered.map((item) => {
              return RED.nodes.getNode(item);
            });

            delete parsedConfig[`${parsedPropName}Template`];
          }
          delete parsedConfig[`${parsedPropName}Encoded`];
        }
      }

      // clean unwanted configs
      cleanProps(parsedConfig);

      console.log("OUTPUT: ", {
        ...parsedConfig,

        id: this.id,
        wires: wires,
      });

      builder.addNode(this.id, parsedConfig.name, parsedConfig, wires);

      msg.payload.origin = this.nodetype;
      msg.payload.originId = this.id;
      msg.payload.trace.push(this.id);
      node.send(msg);
    });
  }

  RED.nodes.registerType("signal", SignalNode);
};
