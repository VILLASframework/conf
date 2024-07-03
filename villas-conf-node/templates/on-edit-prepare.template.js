/**
 * onEditPrepareHandler is designed as a drop in handler to enable the dynamic array extension and more.
 * This must be combined with the on-edit-save handler to enable the functionallity
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
// ---- CONFIGURE ---- Paste before HANDLE_ON_EDIT
/**
 * @param {any} node (propably `this`)
 * @param {any} name the name of the property
 * @param {any} type - The type of the property. Options are : "input", "checkbox", "array", objects of defined shape (see examples)
 * @param {any} defaultValue
 * @example
 * Configure simple inputs
 * configureProp(node, "realtime", "checkbox")
 *
 * When configuring objects can be done by giving the object types and default value as objects.
 * configureProp(node, "in", {signal: "array"}, {signal: []})`
 */
const configureProp = (node, name, type, defaultValue) => {
  if (!node?.propConfig?.props) {
    node.propConfig = {
      props: {},
      values: {},
    };
  }

  node.propConfig.props[name] = type;
  if (defaultValue) {
    node.propConfig.values[name] = defaultValue;
  }
};

// ---- HANDLE_ON_EDIT ----
const handleOnEdit = (node) => {
  const json = $("#node-input-SERIALIZED").val();
  if (json !== "") {
    node.propConfig.values = JSON.parse(json).values;
  }

  const recursivePrepare = (config, names) => {
    for (const name in config) {
      const type = config[name];
      if (typeof type === "string") {
        switch (type) {
          case "select-array":
          case "array":
            prepareArray(node, [...names, name], type);
            break;
          case "checkbox":
            prepareCheckbox(node, [...names, name], type);
            break;
          default:
            prepareRegularInput(node, [...names, name], type);
            break;
        }
      } else if (typeof type === "object") {
        recursivePrepare(config[name], [...names, name]);
      }
    }
  };
  recursivePrepare(node.propConfig.props, []);
};

const prepareCheckbox = (node, names, _type) => {
  const el = document.getElementById(`villas-input-${names.join("-")}`);
  if (!el) {
    console.error("Failed to find input", ...names);
    return;
  }
  el.checked = getNestedProp(node.propConfig.values, names);
};
const prepareRegularInput = (node, names, _type) => {
  const el = document.getElementById(`villas-input-${names.join("-")}`);
  if (!el) {
    console.error("Failed to find input", ...names);
    return;
  }
  if (
    el.tagName == "INPUT" ||
    el.tagName == "SELECT" ||
    el.tagName == "TEXTAREA"
  ) {
    el.value = getNestedProp(node.propConfig.values, names);
  }
};

/**
 * @param {any} node
 * @param {Array<string>} names
 * @param {string} type
 */
const prepareArray = (node, names, type) => {
  const combinedName = names.join("-");
  //specifiers: We utilize a strict naming convention
  const rowName = `villas-array-row-${combinedName} array-row`;
  const templateName = `#villas-array-template-${combinedName}`;
  const containerName = `#villas-array-${combinedName} .form-subrow`;
  const container = $(containerName);

  let defaultValue = "";
  switch (type) {
    case "select-array":
      defaultValue = "_ADD_";
      break;
    default:
      defaultValue = "";
      break;
  }

  const addItem = (val) => {
    const copy = $(templateName).clone(true);

    // now we have to edit the input for some thing to happen
    const copyInput = copy.find(":input").first();
    const rowId = crypto.randomUUID();
    const templateLabel = copy.find("label").first();

    // we should probably not use id's
    copyInput.id = `villlas-input-${combinedName}-${rowId}`;
    templateLabel.for = `villas-input-${combinedName}-${rowId}`;
    copyInput.val(val);

    copyInput.on("change", () => {
      const lastValue = container
        .children()
        .last()
        .find(":input")
        .first()
        .val();
      if (lastValue !== defaultValue) {
        addItem(defaultValue);
      }
    });

    // remove template identifier and thus not hidden and add to subrow
    copy.removeClass(templateName);
    copy.removeClass(`array-template`);
    copy.addClass(rowName);
    copy.appendTo(container);
  };

  const items = getNestedProp(node.propConfig.values, names);
  if (Array.isArray(items)) {
    for (const item of items) {
      addItem(item);
    }
  }

  // add extra at the bottom
  addItem(defaultValue);
};
