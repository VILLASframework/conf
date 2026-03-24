const fs = require('fs');
const mqtt = require('mqtt');

module.exports = function (RED) {

    function MqttVillasNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // Base Configuration
        const host = config.host;
        const port = config.port || 1883;
        const username = config.username || undefined;
        const password = config.password || undefined;
        const keepalive = parseInt(config.keepalive) || 5;
        const qos = parseInt(config.qos) || 0;
        const retain = config.retain || false;
        const format = config.format || 'json'; // only json now
        const vectorize = parseInt(config.vectorize) || 1;
        const builtin = config.builtin !== false; // default true

        const inConfig = config.in || {};
        const outConfig = config.out || {};

        const topicSubscribe = inConfig.subscribe || undefined;
        const topicPublish = outConfig.publish || undefined;

        // SSL Handling
        const sslConfig = config.ssl || {};
        const sslEnabled = sslConfig.enabled || false;
        const sslOptions = {};

        if (sslEnabled) {
            if (sslConfig.cafile) {
                try {
                    sslOptions.ca = fs.readFileSync(sslConfig.cafile);
                } catch (err) {
                    node.error(`Failed to read CA file: ${sslConfig.cafile}`);
                }
            }
            if (sslConfig.certfile) {
                try {
                    sslOptions.cert = fs.readFileSync(sslConfig.certfile);
                } catch (err) {
                    node.error(`Failed to read certificate file: ${sslConfig.certfile}`);
                }
            }
            if (sslConfig.keyfile) {
                try {
                    sslOptions.key = fs.readFileSync(sslConfig.keyfile);
                } catch (err) {
                    node.error(`Failed to read key file: ${sslConfig.keyfile}`);
                }
            }
            if (sslConfig.insecure !== undefined) {
                sslOptions.rejectUnauthorized = !sslConfig.insecure;
            }
        }

        const protocol = sslEnabled ? 'mqtts' : 'mqtt';
        const brokerUrl = `${protocol}://${host}:${port}`;

        // MQTT Client Options
        const mqttOptions = {
            keepalive,
            username,
            password,
            ...sslOptions,
            reconnectPeriod: 5000,
            connectTimeout: 30000,
        };

        const client = mqtt.connect(brokerUrl, mqttOptions);

        client.on('connect', function () {
            node.log(`Connected to MQTT broker: ${brokerUrl}`);

            if (topicSubscribe) {
                client.subscribe(topicSubscribe, { qos }, function (err) {
                    if (err) {
                        node.error(`Failed to subscribe to topic ${topicSubscribe}: ${err.message}`);
                    } else {
                        node.log(`Subscribed to topic: ${topicSubscribe}`);
                    }
                });
            } else {
                node.warn("No subscribe topic configured.");
            }
        });

        client.on('error', function (err) {
            node.error(`Connection error: ${err.message}`);
        });

        client.on('reconnect', function () {
            node.log("Reconnecting to MQTT broker...");
        });

        client.on('close', function () {
            node.log("Connection to broker closed.");
        });

        client.on('offline', function () {
            node.warn("MQTT client offline.");
        });

        client.on('message', function (receivedTopic, message) {
            try {
                let payload = message.toString();
                let samples = [];

                if (format === 'json') {
                    const parsed = JSON.parse(payload);

                    if (Array.isArray(parsed)) {
                        samples = parsed;
                    } else {
                        samples = [parsed];
                    }
                }

                for (let i = 0; i < samples.length; i += vectorize) {
                    const sampleChunk = samples.slice(i, i + vectorize);
                    node.send({
                        topic: receivedTopic,
                        payload: sampleChunk
                    });
                }
            } catch (err) {
                node.error(`Failed to parse incoming message: ${err.message}`);
            }
        });

        node.on('input', function (msg) {
            const publishTopic = msg.topic || topicPublish;

            if (!publishTopic) {
                node.warn("No publish topic configured or specified.");
                return;
            }

            let data;
            try {
                if (format === 'json') {
                    if (vectorize > 1 && Array.isArray(msg.payload)) {
                        data = JSON.stringify(msg.payload);
                    } else {
                        data = JSON.stringify([msg.payload]);
                    }
                }
            } catch (err) {
                node.error(`Failed to serialize message: ${err.message}`);
                return;
            }

            client.publish(publishTopic, data, { qos, retain }, function (err) {
                if (err) {
                    node.error(`Failed to publish to topic ${publishTopic}: ${err.message}`);
                } else {
                    node.debug(`Published to topic ${publishTopic}`);
                }
            });
        });

        node.on('close', function (done) {
            if (client.connected) {
                client.end(false, done);
            } else {
                done();
            }
        });
    }

    RED.nodes.registerType("mqtt-villasnode", MqttVillasNode);
};
