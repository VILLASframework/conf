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
            ...(config.enabled != null && { enabled: config.enabled })
        };

        node.on("input", function (msg) {
            builder.addSignal(this.id, signalConfig, msg);
            msg.payload.originId = this.id;
            node.send(msg);
        });

        this.name = config.name || "Sine";
        this.unit = config.unit || "";
        this.dataType = config.dataType || "float";
        this.initialValue = config.initialValue;
        this.offset = Number(config.offset) || 0;
        this.enabled = config.enabled !== false;
        this.amplitude = Number(config.amplitude);
        this.frequency = Number(config.frequency);
        this.phase = Number(config.phase);
    }

    RED.nodes.registerType("signal-sine", SineSignalNode);
};