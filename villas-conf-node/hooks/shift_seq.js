module.exports = function(RED) {
    function ShiftSeqHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            const offset = parseInt(config.offset) || 0;

            if (config.enabled && msg.payload && typeof msg.payload.sequence === "number") {
                msg.payload.sequence += offset;
            }

            msg.shift_seq = {
                offset: offset,
                enabled: config.enabled,
                priority: config.priority
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("shift_seq", ShiftSeqHook);
};
