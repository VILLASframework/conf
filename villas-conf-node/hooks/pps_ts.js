module.exports = function(RED) {
    function PpsTsHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            msg.pps_ts = {
                timestamp: true,  
                config: {
                    mode: config.mode,
                    threshold: config.threshold,
                    expected_smp_rate: config.expected_smp_rate,
                    horizon_estimation: config.horizon_estimation,
                    horizon_compensation: config.horizon_compensation,
                    signal: config.signal,
                    enabled: config.enabled,
                    priority: config.priority
                }
            };

            node.send(msg);
        });
    }
    RED.nodes.registerType("pps_ts", PpsTsHook);
};
