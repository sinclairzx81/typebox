# Array

Creates an Array type.

## Example

Example usage is shown below.

```typescript
const T = Type.Array(Type.Number())                 // const T = {
                                                    //   type: 'array',
                                                    //   items: {
                                                    //     type: 'number',
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = number[]
```

## Guard

Use the IsArray function to guard values of this type.

```typescript
Type.IsArray(value)                                 // value is TArray                                          
```

## Options

```typescript
export interface TArrayOptions extends TSchemaOptions {
  /** 
   * The minimum number of items allowed in the array. 
   */
  minItems?: number
  /** 
   * The maximum number of items allowed in the array. 
   */
  maxItems?: number
  /** 
   * A schema that at least one item in the array must validate against. 
   */
  contains?: TSchema
  /** 
   * The minimum number of array items that must validate against the `contains` schema. 
   */
  minContains?: number
  /** 
   * The maximum number of array items that may validate against the `contains` schema. 
   */
  maxContains?: number
  /** 
   * An array of schemas, where each schema in `prefixItems` validates against items at corresponding positions from the beginning of the array. 
   */
  prefixItems?: TSchema[]
  /** 
   * If `true`, all items in the array must be unique. 
   */
  uniqueItems?: boolean
}

```