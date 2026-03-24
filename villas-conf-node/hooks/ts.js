module.exports = function(RED) {
    function TsHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            if (config.enabled) {
                const now = new Date();
                const sec = Math.floor(now.getTime() / 1000);
                const nsec = (now.getTime() % 1000) * 1e6;

                if (!msg.payload.ts) {
                    msg.payload.ts = {};
                }

                msg.payload.ts.origin = {
                    sec: sec,
                    nsec: nsec
                };
            }

            msg.ts = {
                overwritten: config.enabled,
                priority: config.priority
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("ts", TsHook);
};
