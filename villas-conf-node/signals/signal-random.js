module.exports = function (RED) {
    function RandomSignalNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const builder = this.context().flow.get("builder");

        const signalConfig = {
            signal: "random",
            name: config.name || "RandomSignal",
            stddev: parseFloat(config.stddev),
            ...(config.initialValue != null && { initialValue: parseFloat(config.initialValue) }),
            ...(config.dataType != null && { dataType: config.dataType }),
            ...(config.unit != null && { unit: config.unit }),
            ...(config.enabled != null && { enabled: config.enabled })
        }

        node.on("input", function (msg) {
            builder.addSignal(this.id, signalConfig, msg);
            msg.payload.originId = this.id;
            node.send(msg);
        });
    }

    RED.nodes.registerType("signal-random", RandomSignalNode);
};