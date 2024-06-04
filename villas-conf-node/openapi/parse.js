const OpenAPIParse = require("@readme/openapi-parser");
async function Parse() {
  let parser = new OpenAPIParse();
  let api = await parser.dereference(
    "./components/schemas/config/nodes/signal_v2_node.yaml",
  );

  //let villasConfigurationSchema = api.components?.schemas?.Config;
  console.log(api);
}

Parse().then();
