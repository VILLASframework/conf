module.exports = function(RED) {
    function AverageHook(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.offset = config.offset || 0;
        node.signals = config.signals || [];
        node.enabled = config.enabled !== false;
        node.priority = config.priority || 99;

        node.on('input', function(msg) {
            if (!node.enabled) {
                node.send(msg);
                return;
            }

            if (!Array.isArray(node.signals) || node.signals.length === 0) {
                node.error("No signals defined for averaging.");
                return;
            }

            try {
                let sum = 0;
                let count = 0;

                
                for (let sig of node.signals) {
                    let value = msg.payload[sig];

                    if (typeof value === 'number') {
                        sum += value;
                        count++;
                    }
                    else {
                        node.warn(`Signal "${sig}" is not a number. Skipping.`);
                    }
                }

                if (count === 0) {
                    node.error("No valid numeric signals found.");
                    return;
                }

                let avg = sum / count;

                
                if (Array.isArray(msg.payload)) {
                    
                    msg.payload.splice(node.offset, 0, avg);
                }
                else if (typeof msg.payload === 'object') {
                    
                    msg.payload['average'] = avg;
                }
                else {
                    node.error("Payload must be an object or array.");
                    return;
                }

                node.send(msg);

            } catch (err) {
                node.error("Failed to calculate average: " + err.message);
            }
        });
    }

    RED.nodes.registerType("average", AverageHook);
}
