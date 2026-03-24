module.exports = function (RED) {
    const dgram = require('dgram');

    function InfluxDBNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const server = config.server || "localhost:8089";
        const key = config.key || "villas";

        const [host, port] = server.split(':');
        const udpClient = dgram.createSocket('udp4');

        node.on('input', function (msg) {
            if (!msg.payload) {
                node.warn("Incoming message has no payload");
                return;
            }

            let influxMessage = `${key}`;
            if (typeof msg.payload === "object") {
                const fields = Object.keys(msg.payload).map(field => `${field}=${formatValue(msg.payload[field])}`);
                influxMessage += ` ${fields.join(',')}`;
            } else {
                influxMessage += ` value=${formatValue(msg.payload)}`;
            }

            const timestamp = generateTimestamp();
            influxMessage += ` ${timestamp}`;

            const messageBuffer = Buffer.from(influxMessage);
            udpClient.send(messageBuffer, parseInt(port), host, (err) => {
                if (err) {
                    node.error("Error sending data to InfluxDB: " + err);
                } else {
                    node.log("Data successfully sent to InfluxDB: " + influxMessage);
                }
            });
        });

        node.on('close', function () {
            udpClient.close();
        });

        function formatValue(value) {
            if (typeof value === 'boolean') {
                return value ? "true" : "false";
            } else if (typeof value === 'number') {
                return value;
            } else {
                return `\"${value}\"`;
            }
        }

        function generateTimestamp() {
            const now = process.hrtime.bigint();
            const seconds = BigInt(Date.now()) / 1000n;
            const nanos = now % 1000000000n;
            return `${seconds}${nanos.toString().padStart(9, '0')}`;
        }
    }

    RED.nodes.registerType("influxdb", InfluxDBNode);
};
