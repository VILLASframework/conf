module.exports = function (RED) {
    function VillasWebRTCNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        console.log("WebRTC Node Loaded!");

        const builder = this.context().flow.get("builder");

        node.on("input", function (msg) {
            const wires = this.wires.flat();
            const nodeConfig = {
                name: config.name || "default_name",
                session: config.session || "my-session-name",
                server: config.server || "wss://villas.k8s.eonerc.rwth-aachen.de/ws/signaling",
                format: config.format || "villas.human",
                wait_seconds: config.wait_seconds !== undefined ? config.wait_seconds : 0,
                ordered: config.ordered !== undefined ? config.ordered : false,
                max_retransmits: config.max_retransmits !== undefined ? config.max_retransmits : 0,
                ice: {
                    servers: config.ice_servers || []
                },
                in: config.in || {
                    signals: [],
                    vectorize: 1,
                    hooks: []
                },
                out: config.out || {
                    vectorize: 0,
                    hooks: []
                },
                hooks: Array.isArray(config.hooks) ? config.hooks : ["print"],
                builtin: config.builtin !== undefined ? config.builtin : true
            };

            builder.addNode(this.id, config.name, nodeConfig, wires);

            msg.payload = {
                ...msg.payload,
                origin: "webrtc",
                originId: this.id,
                trace: [...(msg.payload.trace || []), this.id]
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("webrtc", VillasWebRTCNode);
};
