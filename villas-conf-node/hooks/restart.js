module.exports = function(RED) {
    function RestartHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            msg.restart = {
                enabled: config.enabled,
                priority: config.priority
            };

            if (config.enabled && msg.payload && typeof msg.payload.sequence === 'number') {
                if (msg.payload.sequence === 0) {
                    node.warn("Simulation restart detected (sequence = 0).");
                    msg.simulationRestart = true;
                }
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("restart", RestartHook);
};
