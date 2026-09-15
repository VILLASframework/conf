module.exports = function (RED) {
    function SineSignalNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const builder = this.context().flow.get("builder");

        const signalConfig = {
            signal: "sine",
            name: config.name || "sine",
            ...(config.amplitude != null && { amplitude: Number(config.amplitude) }),
            ...(config.frequency != null && { frequency: Number(config.frequency) }),
            ...(config.phase != null && { phase: Number(config.phase) }),
            ...(config.offset != null && { offset: Number(config.offset) }),
            ...(config.initialValue != null && { initialValue: Number(config.initialValue) }),
            ...(config.dataType != null && { dataType: config.dataType }),
            ...(config.unit != null && { unit: config.unit }),
        };

        node.on("input", function (msg) {
            builder.addSignal(this.id, signalConfig, msg);

            msg.payload = {
                ...msg.payload,
                origin: "signal-sine",
                originId: this.id,
                originName: config.name,
                trace: [...(msg.payload.trace || []), this.id]
            };
            node.send(msg);
        });
    }

    RED.nodes.registerType("signal-sine", SineSignalNode);
};