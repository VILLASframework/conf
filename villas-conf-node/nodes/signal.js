module.exports = function (RED) {
  function SignalNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", function (msg) {
      var { nodes, paths } = msg.payload;
      nodes[this.name] = {
        name: this.name,
        type: "square",
      };
      node.send(msg);
    });
    node.on("editprepare", function (msg) {
      alert("test");
    });
  }
  RED.nodes.registerType("signal", SignalNode);
};
