module.exports = function (RED) {
  function ConfigStartNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
  }
  RED.nodes.registerType("config-start", ConfigStartNode);
};
