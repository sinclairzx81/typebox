# Number

Creates a Number type.

## Example

Example usage is shown below.

```typescript
const T = Type.Number()                             // const T = {
                                                    //   type: 'number'
                                                    // }

type T = Static<typeof T>                           // type T = number
```

## Guard

Use the IsNumber function to guard values of this type.

```typescript
Type.IsNumber(value)                                // value is TNumber
```

## Options

```typescript
export interface TNumberOptions extends TSchemaOptions {
  /** 
   * Specifies an exclusive upper limit for the number (number must be less than this value). 
   */
  exclusiveMaximum?: number | bigint
  /** 
   * Specifies an exclusive lower limit for the number (number must be greater than this value). 
   */
  exclusiveMinimum?: number | bigint
  /** 
   * Specifies an inclusive upper limit for the number (number must be less than or equal to this value). 
   */
  maximum?: number | bigint
  /** 
   * Specifies an inclusive lower limit for the number (number must be greater than or equal to this value). 
   */
  minimum?: number | bigint
  /** 
   * Specifies that the number must be a multiple of this value. 
   */
  multipleOf?: number
}
```