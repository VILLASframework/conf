## Data Transfer Object

Node-red is not designed for array configurations and transfers. 
Thus we use a custom on-edit-prepare handler with JQuery to enable the UI functionality

See `signal.html/js` as an example
We configure the villas schema properties in the oneditprepare handler of the node. This then configures the oneditprepare handle to 
replace all the inputs/checkboxes/textareas/arrays/select-arrays to the result of the previous edit (or the default values).
The inputs must use ids like `villas-input-name` -> `{ name: "..."}` or if they are in a object `villas-input-in-signal`: `{"in": "..."}`

Arrays are special in that they have a template input.

```html

    <div id="villas-array-in-signal">
      <div
        id="villas-array-template-in-signal"
        class="villas-array-template-in-signal array-template"
      >
        <label for="node-input-signalIdTemplate"></label>
        <input
          type="text"
          id="node-input-signalIdTemplate"
          placeholder="_ADD_"
        />
      </div>
      <div class="form-subrow"></div>
    </div>

```

The template will then be copied to `.form-subrow` and replaced with the correct value.

## Configuration Builder

To build the configuration from the graph. We use the NODE-red messaging system.
From the config-start node a new message is passed to all connected nodes.

From now either:
1. it is a node: 
    Then the configuration of the node is added to the builder. 
    If a path is open. Close it and mark ourselfs as the end of the path.
    *AND* a new path is started from that node to somewhere not determined yet.

2. It is a hook:
    Then the hook configuration is added to the path that the parent is on.

Thus the only thing not possible is to share one hook with multiple paths as explained in the code documentation.

```js
    // we have a limitation on something like this:
    // |- Signal1(node) -|
    //                   |- Round(hook) -- Print(hook)
    // |- Signal2(node) -|
    //
    // should both paths end at Print or just one?
    // for now we continue all paths to the end. But for something like this:
    //
    // |- Signal1(node) -|               |- Print1(hook)
    //                   |- Round(hook) -|
    // |- Signal2(node) -|               |- Print2(hook)
    //
    // this results in a undefined behavior. Thus we cannot accept hooks with multiple outputs/wires
```

To avoid this separate hooks with the same configuration should be used.

# There are templates for the oneditprepare and oneditsave functions in `templates`
