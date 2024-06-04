## Data Transfer Object

Node-red is not designed for array configurations and transfers. 
Thus we use a custom on-edit-prepare handler with jquery to enable the ui functionality

then the on-edit-save handler serializes this configuration to json and sends it as a "dummy" props (we use a lot of those
and they are always prefixed with dummy-***".

The json schema looks like:

```json
{
    
}
```
