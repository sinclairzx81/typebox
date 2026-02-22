# Type.Integer

Creates an Integer type.

## Example

Example usage is shown below. 

```typescript
const T = Type.Integer()                            // const T = {
                                                    //   type: 'integer'
                                                    // }

type T = Static<typeof T>                           // type T = number
```

## Guard

Use the IsInteger function to guard values of this type.

```typescript
Type.IsInteger(value)                               // value is TInteger
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

## Remarks

TypeBox models Integer as a narrower form of Number. All integers are numbers, but not all numbers are integers, so Integer is treated as a subset of number within conditional type expressions. This distinction aligns with Json Schema, which defines Integer as a baseline type, even though TypeScript does not differentiate integers from numbers.

```typescript
type A = <'set-of-all-integers'> extends number ? true : false  // type A = true

type B = number extends <'set-of-all-integers'> ? true : false  // type B = false
```

```typescript
const A = Type.Conditional(                                     // const A = { const: true }
  Type.Integer(),  
  Type.Number(),
  Type.Literal(true), 
  Type.Literal(false)
)

const B = Type.Conditional(                                      // const B = { const: false }
  Type.Number() 
  Type.Integer(),
  Type.Literal(true), 
  Type.Literal(false)
)
```
