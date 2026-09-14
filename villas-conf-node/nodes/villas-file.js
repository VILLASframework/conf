module.exports = function (RED) {
    function VillasFileNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        console.log("VILLAS-File Node Loaded!");

        const builder = this.context().flow.get("builder");

        node.on("input", function (msg) {
            const wires = this.wires.flat();
            const nodeConfig = {
                name: config.name || "default_name",
                uri: config.uri || "http://default.uri",
                type: "file",
            };

            builder.addNode(this.id, config.name, nodeConfig, wires);

            msg.payload = {
                ...msg.payload,
                origin: "villas-file",
                originId: this.id,
                trace: [...(msg.payload.trace || []), this.id]
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("villas-file", VillasFileNode);
};
