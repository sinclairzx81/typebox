# Type.Intersect

Creates an Intersect type.

## Example

Example usage is shown below. 

```typescript
const T = Type.Intersect([                          // const T = {
  Type.Object({ x: Type.Number() }),                //   allOf: [{
  Type.Object({ y: Type.Number() }),                //     type: 'object',
])                                                  //     required: ['x'],
                                                    //     properties: {
                                                    //       x: { type: 'number' }
                                                    //     }
                                                    //  }, {
                                                    //    type: 'object',
                                                    //    required: ['y'],
                                                    //    properties: {
                                                    //      y: { type: 'number' }
                                                    //    }
                                                    //  }]
                                                    // }

type T = Static<typeof T>                           // type T = { 
                                                    //   x: number
                                                    // } & {
                                                    //   y: number
                                                    // }

``` 

## Guard

Use the IsInteger function to guard values of this type.

```typescript
Type.IsIntersect(value)                             // value is TIntersect
```

## Options

```typescript
export interface TIntersectOptions extends TSchemaOptions {
  /** 
   * A schema to apply to any properties in the object that were not validated 
   * by other keywords like `properties`, `patternProperties`, or `additionalProperties`. 
   * If `false`, no additional properties are allowed. 
   */
  unevaluatedProperties?: TSchema | boolean
}
```