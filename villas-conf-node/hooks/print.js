module.exports = function(RED) {
    function PrintHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            msg.print = {
                output: config.output,
                format: config.format,
                prefix: config.prefix,
                enabled: config.enabled,
                priority: config.priority
            };

            if (config.enabled) {
                const logMsg = config.prefix ? `${config.prefix}${JSON.stringify(msg.payload)}` : JSON.stringify(msg.payload);
                node.log(logMsg);
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("print", PrintHook);
};
