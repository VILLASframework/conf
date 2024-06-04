/**
 * Renames all props after the standardized villas- convention and adds them to `target`
 * If it should rename the keys, set `props=target`
 * @param {Record<string, any>} props the object to renmae all props
 * @param {Record<string, any>} target - the target object to insert all renamed props to. Set `target=props` to rename in place
 * @param {boolean} [deleteOld=true] - whether to remove the old key if found. Only affects the `target` object. `props` is not edited.
 */
function renameProps(props, target, deleteOld = true) {
  for (const property in props) {
    // go through
    if (/^villas-.+/.test(property)) {
      target[property.slice("villas-".length)] = props[property];
    }
    if (deleteOld) {
      delete target[property];
    }
  }
}

function deserializeProps(prop) {
	const decoded = JSON.parse(prop);
	const parseAndCleanProps(decoded);
  for (const property in props) {
    if (/^villasobj-.+/.test(property)) {
      //decompose the json object to an javascript object

      try {
        const decoded = JSON.parse(props[property]);
      } catch (_err) {
        throw new Error("JSON parsing error");
      }
    }
  }
}

function parseAndCleanProps(){
	
}

function cleanProps(props) {
  delete props.x;
  delete props.y;
  delete props.z;
  delete props.wires;
  delete props._closeCallbacks;
  delete props.id;
}

function decomposeObject(props) {
  for (const property in props) {
    if (/^villasobj-.+/.test(property)) {
      //decompose the json object to an javascript object

      try {
        const decoded = JSON.parse(props[property]);
      } catch (_err) {
        throw new Error("JSON parsing error");
      }
    }
  }
}

function decomposeArrays(props) {
  const clone = { ...props };
  for (const property in props) {
    if (/^.+Encoded$/.test(property)) {
      const parsedPropName = property.slice(
        0,
        property.length - "Encoded".length,
      );

      const parsed = JSON.parse(props[property]);

      if (parsed.type === "INPUT") {
        clone[parsedPropName] = parsed.values;
      } else {
        const filtered = parsed.values.filter((x) => x !== "_ADD_");
        clone[parsedPropName] = filtered.map((item) => {
          return RED.nodes.getNode(item);
        });

        delete clone[`${parsedPropName}Template`];
      }
      delete clone[`${parsedPropName}Encoded`];
    }
  }
}

module.exports = {
  cleanProps: cleanProps,
  renameProps: renameProps,
  decomposeObject: decomposeObject,
  decomposeArrays: decomposeArrays,
};
