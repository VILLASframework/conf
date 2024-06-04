const saveArray = (node, name) => {
  const items = $(`.array-${name} .form-subrow`).children();
  if (!items || items === undefined || items.length === 0) {
    node[name] = [];
    return;
  }

  let inputType = "";

  const values = [];
  for (const item of items) {
    const input = $(item).find(":input").first();

    if (inputType === "") {
      inputType = input.prop("nodeName");
    }

    const value = input.val();
    if (value !== undefined && value !== "") {
      values.push(value);
    }
  }
  node[name] = values;
  $(`.array-${name} .array-encoded`)
    .first()
    .val(JSON.stringify({ values: values, type: inputType }));
};

const arrayConfigurator = (node, name) => {
  const isSelect = $(`.array-template-${name}`).hasClass("select");
  const addItem = (val = isSelect ? "_ADD_" : "") => {
    const subrow = $(`.array-${name} .form-subrow`);
    const template = $(`.array-template-${name}`).clone(true);

    // now we have to edit the input for some thing to happen
    const templateInput = template.find(":input").first();
    const templateLabel = template.find("label").first();
    const rowId = crypto.randomUUID();

    // we should probably not use labels
    templateInput.id = `array-input-${rowId}`;
    templateLabel.for = `array-input-${rowId}`;
    templateInput.val(val);

    templateInput.on("change", () => {
      const lastValue = $(`.array-${name} .form-subrow div`)
        .last()
        .find(":input")
        .first()
        .val();
      const isLastEmpty = lastValue === "" || lastValue === "_ADD_";
      if (!isLastEmpty) {
        addItem(isSelect ? "_ADD_" : "");
      }
    });

    /* if (template.hasClass("select")) {
            template.find("a").remove();
          } */

    // remove template identifier and thus not hidden and add to subrow
    template.removeClass(`array-template-${name}`);
    template.removeClass(`array-template`);
    template.addClass(`array-row-${name} array-row`);
    template.appendTo(subrow);
  };

  console.log("node: ", node[name]);

  if (node[name] !== undefined && Array.isArray(node[name])) {
    for (const item of node[name].filter((x) => x !== "_ADD_")) {
      addItem(item);
    }
  } else if (
    node[`${name}Encoded`] !== undefined &&
    node[`${name}Encoded`] !== ""
  ) {
    const decoded = JSON.parse(node[`${name}Encoded`]).values;
    for (const item of decoded.filter((x) => x !== "_ADD_")) {
      addItem(item);
    }
  }

  // finally add last empty/default item
  addItem();
};
