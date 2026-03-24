module.exports = function(RED) {
    function PmuDftHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            const signals = (config.signals || "").split(",").map(s => s.trim());
            
            delete msg.payload;

            msg.pmu_dft = {
                amplitude: 0,
                frequency: 0,
                phase: 0,
                rocof: 0,
                config: {
                    sample_rate: config.sample_rate,
                    start_frequency: config.start_frequency,
                    end_frequency: config.end_frequency,
                    frequency_resolution: config.frequency_resolution,
                    dft_rate: config.dft_rate,
                    window_size_factor: config.window_size_factor,
                    window_type: config.window_type,
                    padding_type: config.padding_type,
                    frequency_estimate_type: config.frequency_estimate_type,
                    pps_index: config.pps_index,
                    angle_unit: config.angle_unit,
                    add_channel_name: config.add_channel_name,
                    timestamp_align: config.timestamp_align,
                    phase_offset: config.phase_offset,
                    amplitude_offset: config.amplitude_offset,
                    frequency_offset: config.frequency_offset,
                    rocof_offset: config.rocof_offset,
                    enabled: config.enabled,
                    priority: config.priority,
                    signals: signals
                }
            };

            node.send(msg);
        });
    }
    RED.nodes.registerType("pmu_dft", PmuDftHook);
};
