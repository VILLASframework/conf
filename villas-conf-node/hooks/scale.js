module.exports = function(RED) {
    function ScaleHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            const gain = parseFloat(config.gain) || 1.0;
            const offset = parseFloat(config.offset) || 0.0;
            const signalList = (config.signals || "").split(",").map(s => s.trim());

            if (config.enabled && msg.payload && typeof msg.payload === "object") {
                for (const key of signalList) {
                    if (msg.payload[key] !== undefined && typeof msg.payload[key] === "number") {
                        msg.payload[key] = msg.payload[key] * gain + offset;
                    }
                }
            }

            msg.scale = {
                gain: gain,
                offset: offset,
                signals: signalList,
                enabled: config.enabled,
                priority: config.priority
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("scale", ScaleHook);
};
