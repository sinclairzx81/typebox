# Type.Object

Creates an Object type.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T = {
  x: Type.Number(),                                 //   type: 'object',
  y: Type.Number(),                                 //   required: ['x', 'y', 'z'],
  z: Type.Number()                                  //   properties: {
})                                                  //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }
```

## Guard

Use the IsObject function to guard values of this type.

```typescript
Type.IsObject(value)                                // value is TObject
```

## Options

The following options are available for Object

```typescript
export interface TObjectOptions extends TSchemaOptions {
  /** 
   * Defines whether additional properties are allowed beyond those explicitly defined in `properties`. 
   */
  additionalProperties?: TSchema | boolean
  /** 
   * The minimum number of properties required in the object. 
   */
  minProperties?: number
  /** 
   * The maximum number of properties allowed in the object. 
   */
  maxProperties?: number
  /** 
   * Defines conditional requirements for properties. 
   */
  dependencies?: Record<string, boolean | TSchema | string[]>
  /** 
   * Specifies properties that *must* be present if a given property is present. 
   */
  dependentRequired?: Record<string, string[]>
  /** 
   * Defines schemas that apply if a specific property is present. 
   */
  dependentSchemas?: Record<string, TSchema>
  /** 
   * Maps regular expressions to schemas properties matching a pattern must validate against the schema. 
   */
  patternProperties?: Record<string, TSchema>
  /** 
   * A schema that all property names within the object must validate against. 
   */
  propertyNames?: TSchema
}
```
