module.exports = function (RED) {
    function VillasSocketNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on("input", function (msg) {
            msg.payload = {
                ...msg.payload,
                layer: config.layer || "udp",
                format: config.format || "villas.human",
                verify_source: config.verify_source || false,
                vectorize: config.vectorize || 1,
                in: { address: config.address_in || "127.0.0.1:12001" },
                out: { address: config.address_out || "127.0.0.1:12000" },
                hooks: Array.isArray(config.hooks) ? config.hooks : ["print"],
                builtin: config.builtin !== undefined ? config.builtin : true
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("socket", VillasSocketNode);
};
