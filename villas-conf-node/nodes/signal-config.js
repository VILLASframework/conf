module.exports = function (RED) {
  function SignalConfigNode(n) {
    RED.nodes.createNode(this, n);
    for (const property in n) {
      if (/^villas-.+/.test(property)) {
        this[property] = n[property];
      }
    }
    this.signalId = n.signalId;
  }
  RED.nodes.registerType("signal-config", SignalConfigNode);
};
