/**
 * on-edit-save is designed as a drop in handler to enable the dynamic array extension and more.
 * This must be combined with the on-edit-prepare handler to enable the functionallity
 */
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
  if (!path || path.length == 0) {
    return;
  }
  let ref = obj;
  const last = path[path.length - 1];
  for (const propName of path.slice(0, -1)) {
    if (!ref[propName]) ref[propName] = {};
    ref = ref[propName];
  }
  return ref[last];
};
// ---- HANDLE_ON_SAVE ---- Paste in  oneditsave
const handleOnSave = (node) => {
  const recursiveSave = (config, names) => {
    for (const name in config) {
      const type = config[name];
      if (typeof type === "string") {
        switch (type) {
          case "select-array":
          case "array":
            saveArray(node, [...names, name], type);
            break;
          case "checkbox":
            saveCheckbox(node, [...names, name], type);
            break;
          default:
            //normal input
            saveRegularInput(node, [...names, name], type);
            break;
        }
      } else if (typeof type === "object") {
        recursiveSave(config[name], [...names, name]);
      }
    }
  };

  recursiveSave(node.propConfig.props, []);
  const json = JSON.stringify(node.propConfig);

  node["SERIALIZED"] = json;
  $("#node-input-SERIALIZED").val(json);
};

/**
 * @param {any} node
 * @param {Array<string>} names
 * @param {any} type
 */
function saveRegularInput(node, names, _type) {
  const el = document.getElementById(`villas-input-${names.join("-")}`);
  if (!el) {
    console.error("Failed finding input ", ...names);
    return;
  }
  if (
    el.tagName == "INPUT" ||
    el.tagName == "SELECT" ||
    el.tagName == "TEXTAREA"
  ) {
    setNestedProp(node.propConfig.values, names, el.value);
  }
}

/**
 * @param {any} node
 * @param {Array<string>} names
 * @param {any} type
 */
const saveCheckbox = (node, names, _type) => {
  const el = document.getElementById(`villas-input-${names.join("-")}`);
  if (!el) {
    console.error("Failed finding input ", ...names);
    return;
  }
  setNestedProp(node.propConfig.values, names, el.checked);
};

/**
 * @param {any} node
 * @param {Array<string>} names
 * @param {any} type
 */
const saveArray = (node, names, type) => {
  const containerName = `#villas-array-${names.join("-")} .form-subrow`;
  const rows = $(containerName).children();

  if (!rows || rows === undefined || rows.length === 0) {
    setNestedProp(node.propConfig.values, names, []);
    return;
  }

  let defaultValue = "";
  switch (type) {
    case "select-array":
      defaultValue = "_ADD_";
      break;
    default:
      defaultValue = "";
      break;
  }

  let items = getNestedProp(node.propConfig.values, names);
  if (!items || !Array.isArray(items)) {
    items = [];
  }
  for (const row of rows) {
    const value = $(row).find(":input").first().val();
    if (value == defaultValue || items.includes(value)) {
      //skip
      continue;
    }

    items.push(value);
  }
  setNestedProp(node.propConfig.values, names, items);
};
