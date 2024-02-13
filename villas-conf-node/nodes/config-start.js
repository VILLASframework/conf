module.exports = function (RED) {
  function ConfigStartNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", function (msg, send, done) {
      console.log(msg);
      node.send(msg);
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
          console.log(node);
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
