module.exports = function(RED) {
    function SkipFirstHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        let skippedSamples = 0;
        let startTime = null;

        node.on('input', function(msg) {
            const samplesToSkip = parseInt(config.samples) || 0;
            const secondsToSkip = parseFloat(config.seconds) || 0;
            const now = Date.now();

            // Initialize reference time on first input
            if (startTime === null) {
                startTime = now;
                skippedSamples = 0;
            }

            let drop = false;

            if (config.enabled) {
                if (samplesToSkip > 0 && skippedSamples < samplesToSkip) {
                    skippedSamples++;
                    drop = true;
                }
                if (!drop && secondsToSkip > 0 && (now - startTime) < secondsToSkip * 1000) {
                    drop = true;
                }
            }

            msg.skip_first = {
                samples: samplesToSkip,
                seconds: secondsToSkip,
                dropped: drop,
                enabled: config.enabled,
                priority: config.priority
            };

            if (!drop) {
                node.send(msg);
            } else {
                node.status({ fill: "yellow", shape: "dot", text: "skipping..." });
            }
        });

        node.on('close', function () {
            skippedSamples = 0;
            startTime = null;
        });
    }

    RED.nodes.registerType("skip_first", SkipFirstHook);
};
