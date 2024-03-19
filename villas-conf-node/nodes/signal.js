const { ConfBuilder } = require("../builder/builder");

module.exports = function (RED) {
  function SignalNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", function (msg) {
      const builder = new ConfBuilder(msg.payload);
      builder.print();

      console.log(config);

      builder.addNode(this.name, {
        type: config.nodetype,
      });

      builder.print();

      msg.payload = builder.config;
      node.send(msg);
    });
    node.on("editprepare", function (msg) {
      alert("test");
    });
  }
  RED.nodes.registerType("signal", SignalNode);
};
