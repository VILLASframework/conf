module.exports = function(RED) {
    function ShiftTsHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            const offset = parseFloat(config.offset) || 0.0;
            const mode = config.mode;

            if (config.enabled && msg.payload && msg.payload.ts) {
                const tsField = mode === "received" ? "received" : "origin";
                const ts = msg.payload.ts[tsField];

                if (ts && typeof ts === "object" && typeof ts.sec === "number" && typeof ts.nsec === "number") {

                    const original = ts.sec + ts.nsec / 1e9;
                    const shifted = original + offset;
                    const shiftedSec = Math.floor(shifted);
                    const shiftedNsec = Math.round((shifted - shiftedSec) * 1e9);

                    msg.payload.ts[tsField] = {
                        sec: shiftedSec,
                        nsec: shiftedNsec
                    };
                }
            }

            msg.shift_ts = {
                offset: offset,
                mode: mode,
                enabled: config.enabled,
                priority: config.priority
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("shift_ts", ShiftTsHook);
};
