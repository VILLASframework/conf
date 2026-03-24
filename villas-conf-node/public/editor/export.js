RED.plugins.registerPlugin("custom-export-button", {
    onadd: function () {
        const exportButton = $('<button class="red-ui-button red-ui-header-button">')
            .attr('title', 'Export Flow as villas.config')
            .html('<i class="fa fa-download"></i> Export')
            .click(async function () {
                try {
                  
                    const flow = await RED.nodes.convertNodesToFlow(RED.nodes.createCompleteNodeSet(true));
                    const flowString = JSON.stringify(flow, null, 2);

                    
                    const blob = new Blob([flowString], { type: "application/json" });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "villas.config";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (err) {
                    console.error("Export failed:", err);
                    alert("Export failed. See console for details.");
                }
            });

        
        $("#red-ui-header-toolbar").append(exportButton);
    }
});
