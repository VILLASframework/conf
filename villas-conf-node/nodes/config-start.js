const { ConfBuilder } = require("../builder/builder");

module.exports = function (RED) {
  function ConfigStartNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // init the shared ConfigurationBuilder
    // from here on out we only use the path ordering and configurations from nodes not the messaging system
    const http = config.httpEnabled
      ? {
          port: parseInt(config.httpPort),
          ...(config.ssl_cert != null && { ssl_cert: config.ssl_cert }),
          ...(config.ssl_private_key != null && { ssl_private_key: config.ssl_private_key }),
        }
      : undefined;
    this.context().flow.set("builder", new ConfBuilder({ http }));

    node.on("input", function (_msg, _send, _done) {
      const newMSG = {
        payload: {
          origin: "start",
          originID: this.id,
          trace: [this.id],
        },
      };
      node.send(newMSG);
    });
  }
  RED.nodes.registerType("config-start", ConfigStartNode);
  RED.httpAdmin.post(
    "/startconfig/:id",
    RED.auth.needsPermission("inject.write"),
    function (req, res) {
      var node = RED.nodes.getNode(req.params.id);
      if (node != null) {
        try {
          if (req.body) {
            node.receive(req.body);
          } else {
            node.error(RED._("config-start.failed", { error: "body missing" }));
          }
          res.sendStatus(200);
        } catch (err) {
          res.sendStatus(500);
          node.error(RED._("inject.failed", { error: err.toString() }));
        }
      } else {
        res.sendStatus(404);
      }
    },
  );
};
