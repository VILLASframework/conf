const { cleanProps, renameProps } = require("../utils/backend");

module.exports = function (RED) {
  function SignalConfigNode(n) {
    RED.nodes.createNode(this, n);
    renameProps(n, this, false);
    this.signalId = n.signalId;
    cleanProps(this);
  }
  RED.nodes.registerType("signal-config", SignalConfigNode);
};
