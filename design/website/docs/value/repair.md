# Value.Repair

The Repair function will repair a value to match the provided type. If the value already matches, no action is taken. This function will try to retain as much information as possible from the original value. 

## Example

Example usage is shown below.

```typescript
const T = Type.Object({ 
  x: Type.Number(), 
  y: Type.Number() 
}, { additionalProperties: false })                 // Tip: Use additionalProperties: false if you want
                                                    // Repair to remove excess properties. By default,
                                                    // the Repair function retain excess properties to 
                                                    // avoid data loss.

// ...

const A = Value.Repair(T, null)                     // const A = { x: 0, y: 0 }

const B = Value.Repair(T, { x: 1 })                 // const B = { x: 1, y: 0 }

const C = Value.Repair(T, { x: 1, y: 2, z: 3 })     // const C = { x: 1, y: 2 }

const D = Value.Repair(T, { x: true, y: '42' })    // const D = { x: 1, y: 42 }

```