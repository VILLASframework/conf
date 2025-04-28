module.exports = function (RED) {
    function VillasWebRTCNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const builder = this.context().flow.get("builder");

        const nodeConfig = {
            name: config.name || "default_name",
            session: config.session || "my-session-name",
            server: config.server || "wss://villas.k8s.eonerc.rwth-aachen.de/ws/signaling",
            format: config.format || "villas.human",
            wait_seconds: parseInt(config.wait_seconds) || 0,
            ordered: config.ordered !== undefined ? config.ordered : false,
            max_retransmits: parseInt(config.max_retransmits) || 0,
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

        node.on("input", function (msg) {
            const wires = this.wires.flat();

            builder.addNode(this.id, config.name, nodeConfig, wires);

            msg.payload = {
                ...msg.payload,
                origin: "webrtc",
                originId: this.id,
                trace: [...(msg.payload.trace || []), this.id]
            };

            node.send(msg);
        });

        node.on("close", function () {
            node.log("WebRTC Node closed.");
        });
    }

    RED.nodes.registerType("webrtc", VillasWebRTCNode);
};