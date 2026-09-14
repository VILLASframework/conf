module.exports = function(RED) {
    function RmsHook(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        const builder = this.context().flow.get("builder");

        const rmshookConfig = {
            type: config.hooktype || "rms",
            window_size: config.windowsize,
            ...(config.windowsize != null && { window_size: Number(config.windowsize) }),
            signals: [],
            enabled: config.enabled,
            priority: config.priority,
        }

        node.on('input', function(msg) {
            const wires = this.wires.flat();
            builder.addHook2(this.id, rmshookConfig, msg, wires);

            msg.payload = {
                ...msg.payload,
                origin: this.hooktype,
                originId: this.id,
                trace: [...(msg.payload.trace || []), this.id]
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("rms",RmsHook);
}
