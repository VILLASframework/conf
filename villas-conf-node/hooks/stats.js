module.exports = function(RED) {
    function StatsHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        let counter = 0;
        let lastTime = Date.now();

        node.on('input', function(msg) {
            if (config.enabled) {
                counter++;
                const now = Date.now();
                const deltaMs = now - lastTime;

                msg.stats = {
                    sample_count: counter,
                    gap_received_ms: deltaMs,
                    config: {
                        format: config.format,
                        buckets: config.buckets,
                        warmup: config.warmup,
                        verbose: config.verbose,
                        output: config.output,
                        priority: config.priority
                    }
                };

                lastTime = now;
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("stats", StatsHook);
};
