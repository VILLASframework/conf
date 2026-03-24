module.exports = function (RED) {
    function VillasWebSocketNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const builder = this.context().flow.get("builder");

        const nodeConfig = {
            format: config.format || "villas.human",
            destinations: Array.isArray(config.destinations)
                ? config.destinations
                : (typeof config.destinations === 'string' ? config.destinations.split(',') : []),
            in: {
                signals: config.signals || [],
                vectorize: parseInt(config.vectorize) || 1,
                hooks: Array.isArray(config.hooks) ? config.hooks : []
            },
            out: {
                vectorize: parseInt(config.out_vectorize) || 0,
                hooks: Array.isArray(config.out_hooks) ? config.out_hooks : []
            },
            hooks: Array.isArray(config.hooks) ? config.hooks : ["print"],
            builtin: config.builtin !== undefined ? config.builtin : true
        };

        node.on("input", function (msg) {
            const wires = this.wires.flat();

            builder.addNode(this.id, config.name, nodeConfig, wires);

            msg.payload = {
                ...msg.payload,
                origin: "websocket",
                originId: this.id,
                trace: [...(msg.payload.trace || []), this.id]
            };

            node.send(msg);
        });

        node.on("close", function () {
            node.log("WebSocket Node closed.");
        });
    }

    RED.nodes.registerType("websocket", VillasWebSocketNode);
};