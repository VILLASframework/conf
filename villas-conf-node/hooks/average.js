module.exports = function(RED) {
    function AverageHook(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        const builder = this.context().flow.get("builder");

        const hookConfig = {
            type: "average",
            signals: [],
            ...(config.offset != null && { offset: Number(config.offset) }),
            ...(config.priority != null && { priority: Number(config.priority) }),
        }

        node.on('input', function(msg) {
            const wires = this.wires.flat();
            hookConfig.signals = [];

            builder.addHook2(this.id, hookConfig, msg, wires);

            msg.payload = {
                ...msg.payload,
                origin: this.hooktype,
                originId: this.id,
                trace: [...(msg.payload.trace || []), this.id]
            }
            node.send(msg);

        });
    }

    RED.nodes.registerType("average", AverageHook);
}
