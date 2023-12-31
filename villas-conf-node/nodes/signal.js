module.exports = function(RED) {
    function SignalNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('inject', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("signal",SignalNode);
}
