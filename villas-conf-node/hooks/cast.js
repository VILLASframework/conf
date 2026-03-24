module.exports = function(RED) {
    function CastHook(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.new_type = config.new_type || "";
        node.new_name = config.new_name || "";
        node.new_unit = config.new_unit || "";
        node.signals = config.signals || [];
        node.enabled = config.enabled !== false;
        node.priority = config.priority || 99;

        node.on('input', function(msg) {
            if (!node.enabled) {
                node.send(msg);
                return;
            }

            if (!Array.isArray(node.signals) || node.signals.length === 0) {
                node.error("No signals defined for casting.");
                return;
            }

            try {
                for (let sig of node.signals) {
                    let value = msg.payload[sig];

                    if (value === undefined) continue;

                    let castedValue;

                    switch (node.new_type) {
                        case "integer":
                            castedValue = parseInt(value);
                            if (isNaN(castedValue)) castedValue = 0;
                            break;
                        case "float":
                            castedValue = parseFloat(value);
                            if (isNaN(castedValue)) castedValue = 0.0;
                            break;
                        case "boolean":
                            castedValue = !!value;
                            break;
                        case "complex":
                            castedValue = { re: parseFloat(value) || 0.0, im: 0.0 };
                            break;
                        default:
                            castedValue = value;
                            break;
                    }

                    let newFieldName = node.new_name || sig;
                    msg.payload[newFieldName] = castedValue;

                    if (node.new_name && node.new_name !== sig) {
                        delete msg.payload[sig];
                    }
                }

                node.send(msg);

            } catch (err) {
                node.error("Failed to cast signal: " + err.message);
            }
        });
    }

    RED.nodes.registerType("cast", CastHook);
}
