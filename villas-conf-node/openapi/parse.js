const OpenAPIParse = require("@readme/openapi-parser");
async function Parse() {
  let parser = new OpenAPIParse();
  let api = await parser.dereference("./openapi.yaml");

  let villasConfigurationSchema = api.components?.schemas?.Config;
  if (!villasConfigurationSchema) {
    throw new Error("Could not load villas configuration schema");
  }
  let nodeConfigs = villasConfigurationSchema.allOf.filter((x) => {
    if (!x.required || !Array.isArray(x.required)) {
      return false;
    }
    return x.required.includes("nodes");
  })[0];
  console.log(nodeConfigs.properties.nodes.additionalProperties);
}

Parse().then();
