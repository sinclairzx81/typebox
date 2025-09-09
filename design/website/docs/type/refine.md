# Refine

The Refine function applies explicit validation logic to a type. 

> ⚠️ The Refine function will hinder the portability of your type. This is because Refine functions contain implicit rules and logic that cannot be encoded as Json Schema metadata. Refine should only be used if you do not need to share types with other systems.

## Example

The following creates a Refine type that performs cross property value checks.

```typescript
const T = Type.Refine(Type.Object({                 // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number()                                  //   required: ['x', 'y'],
}), value => {                                      //   properties: {
  return value.x === value.y                        //     x: { type: 'number' },
}, 'x and y should be equal')                       //     y: { type: 'number' }
                                                    //   }
                                                    //   '~refine': [(value) => { ... }, '...']
                                                    // }

const E = Value.Errors(T, { x: 1, y: 2 })           // const E = [{
                                                    //   keyword: "~refine",
                                                    //   schemaPath: "#/~refine",
                                                    //   instancePath: "",
                                                    //   params: { index: 0, message: "x and y should be equal" },
                                                    //   message: "x and y should be equal"
                                                    // }]
```