module.exports = function (RED) {
    function CounterSignalNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const builder = this.context().flow.get("builder");

        const signalConfig = {
            signal: "counter",
            name: config.name || "counter",
            ...(config.offset != null && { offset: Number(config.offset) }),
            ...(config.initialValue != null && { initialValue: Number(config.initialValue) }),
            ...(config.dataType != null && { dataType: config.dataType }),
            ...(config.unit != null && { unit: config.unit }),
        };

        node.on("input", function (msg) {
            builder.addSignal(this.id, signalConfig, msg);

            msg.payload = {
                ...msg.payload,
                origin: "signal-counter",
                originId: this.id,
                originName: config.name,
                trace: [...(msg.payload.trace || []), this.id]
            };
            node.send(msg);
        });
    }

    RED.nodes.registerType("signal-counter", CounterSignalNode);
};