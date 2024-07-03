// ---- UTILS ---- Paste in both oneditsave and oneditprepare
/**
 * @param {any} obj
 * @param {Array<string>} path
 * @param {any} val
 */
const setNestedProp = (obj, path, val) => {
  let ref = obj;
  const last = path[path.length - 1];
  for (const propName of path.slice(0, -1)) {
    if (!ref[propName]) ref[propName] = {};
    ref = ref[propName];
  }
  ref[last] = val;
};
/**
 * @param {any} obj
 * @param {Array<string>} path
 */
const getNestedProp = (obj, path) => {
  let ref = obj;
  const last = path[path.length - 1];
  for (const propName of path.slice(0, -1)) {
    if (!ref[propName]) ref[propName] = {};
    ref = ref[propName];
  }
  return ref[last];
};
/**
 * @param {any} RED
 * @param {any} globalConfig
 * @param {any} config
 * @param {Array<string>} names
 */
function expandSignals(RED, globalConfig, config, names) {
  for (const name in config) {
    const type = config[name];
    console.log("type: ", type);
    if (type === "select-array") {
      console.log(globalConfig.values);
      const arr = getNestedProp(globalConfig.values, [...names, name]);
      for (const id of arr) {
        console.log(id);
        setNestedProp(
          globalConfig.values,
          [...names, name],
          RED.nodes.getNode(id),
        );
      }
    } else if (typeof type === "object") {
      expandSignals(RED, globalConfig, config[name], [...names, name]);
    }
  }
}

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

function cleanProps(props) {
  delete props.x;
  delete props.y;
  delete props.z;
  delete props.wires;
  delete props._closeCallbacks;
  delete props.id;
}

module.exports = {
  cleanProps: cleanProps,
  renameProps: renameProps,
  expandSignals: expandSignals,
};
