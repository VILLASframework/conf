/** onEditPrepareHandler is designed as a drop in handler to enable the dynamic array extension and more.
 * This must be combined with the on-edit-save handler to enable the functionallity
 * @param node the node to get the props from
 */
const onEditPrepareHandler = (node, name) => {
  const prop = node[name];

	// Sub Handlers
  const objectConfigurator = (node, name) => {
    const encodedInput = $(`.object-${name}Encoded`) || [];
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

	// handler invocation
	for (const prop in props)
};
