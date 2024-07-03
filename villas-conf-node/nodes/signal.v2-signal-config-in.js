const { cleanProps, renameProps } = require("../utils/backend");

module.exports = function (RED) {
  function SignalConfigNode(n) {
    RED.nodes.createNode(this, n);
    renameProps(n, this, false);
    cleanProps(this);
  }
  RED.nodes.registerType("signal.v2-signal-config-in", SignalConfigNode);
};
