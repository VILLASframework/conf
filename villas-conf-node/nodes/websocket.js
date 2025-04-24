module.exports = function (RED) {
    function VillasWebSocketNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        console.log("WebSocket Node Loaded!");

        const builder = this.context().flow.get("builder");

        node.on("input", function (msg) {
            const wires = this.wires.flat();
            const nodeConfig = {
                format: config.format || "villas.human",
                destinations: config.destinations ? config.destinations.split(",") : [],
                in: {
                    signals: config.signals || [],
                    vectorize: config.vectorize !== undefined ? config.vectorize : 1,
                    hooks: config.hooks || []
                },
                builtin: config.builtin !== undefined ? config.builtin : true,
                out: {
                    vectorize: config.out_vectorize !== undefined ? config.out_vectorize : 0,
                    hooks: config.out_hooks || []
                }
            };

            builder.addNode(this.id, config.name, nodeConfig, wires);

            msg.payload = {
                ...msg.payload,
                origin: "websocket",
                originId: this.id,
                trace: [...(msg.payload.trace || []), this.id]
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("websocket", VillasWebSocketNode);
};
