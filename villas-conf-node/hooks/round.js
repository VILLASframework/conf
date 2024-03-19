module.exports = function (RED) {
  function RoundNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Create one ConfigurationBuilder instance
    node.on("input", function (msg) {
      // we want to merge all configuration
      // count the number of wires
      // only send once all wire messages came in
    });
  }
  RED.nodes.registerType("round", RoundNode);
};
