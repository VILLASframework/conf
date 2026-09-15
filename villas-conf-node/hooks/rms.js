module.exports = function(RED) {
    function RmsHook(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        const builder = this.context().flow.get("builder");

        const rmshookConfig = {
            type: "rms",
            signals: [],
            ...(config.windowsize != null && { window_size: Number(config.windowsize) }),
            ...(config.priority != null && { priority: Number(config.priority) }),
        }

        node.on('input', function(msg) {
            const wires = this.wires.flat();
            rmshookConfig.signals = [];

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
