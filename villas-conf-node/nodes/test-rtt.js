module.exports = function (RED) {
    const fs = require('fs');
    const path = require('path');

    function TestRTTNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const prefix = config.prefix || "test_rtt";
        const outputDir = config.output || "./results";
        const cooldown = parseFloat(config.cooldown) || 0;
        const format = config.format || "villas.human";
        const vectorize = parseInt(config.vectorize) || 1;

        node.on('input', function (msg) {
            if (!msg.payload) {
                node.warn("Incoming message has no payload");
                return;
            }

            const timestamp = new Date().toISOString().replace(/:/g, "-");
            const fileName = `${prefix}_${timestamp}.log`;
            const filePath = path.join(outputDir, fileName);

            const metaData = {
                format: format,
                cooldown: `${cooldown}s`,
                vectorize: vectorize,
                timestamp: new Date().toISOString()
            };

            const testCaseData = `Metadata: ${JSON.stringify(metaData, null, 2)}\n\nPayload:\n${JSON.stringify(msg.payload, null, 2)}`;

            fs.mkdir(outputDir, { recursive: true }, (err) => {
                if (err) {
                    node.error("Error creating output directory: " + err);
                    return;
                }

                fs.writeFile(filePath, testCaseData, (err) => {
                    if (err) {
                        node.error("Error saving RTT test file: " + err);
                    } else {
                        node.log("RTT test file saved: " + filePath);
                    }
                });
            });
        });

        node.on('close', function () {
            node.log("TestRTTNode closed.");
        });
    }

    RED.nodes.registerType("test-rtt", TestRTTNode);
};