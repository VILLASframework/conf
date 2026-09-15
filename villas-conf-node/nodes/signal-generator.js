module.exports = function (RED) {
    function SignalGeneratorNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const builder = this.context().flow.get("builder");
        const nodeConfig =  {
            realtime: config.realtime,
            rate: parseFloat(config.rate),
            type: "signal.v2",
            in: {
                signals: config.signals || [],
            },
        };

        node.on("input", function (msg) {
            const wires = this.wires.flat();
            builder.addNode(this.id, config.name, nodeConfig, wires);

            msg.payload = {
                ...msg.payload,
                origin: "signal-generator",
                originId: this.id,
                originName: config.name,
                trace: [...(msg.payload.trace || []), this.id]
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("signal-generator", SignalGeneratorNode);
};