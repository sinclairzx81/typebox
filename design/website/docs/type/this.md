# This

Creates a This type. 

> ⚠️ The `This` type is supported for top level Object and Interface types only. The type is represented as a `{ $ref: '#' }` reference that will always points to the root of the schema. TypeBox does not transform `#` references when embedding Objects within other Objects so care should be taken when using this type.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({                             // const T = {
  items: Type.Array(Type.This())                    //   type: 'object',
})                                                  //   required: ['items'],
                                                    //   properties: {
                                                    //     items: { $ref: '#' }
                                                    //   }
                                                    // }

type T = Static<typeof T>                           // type T = object
```

## Guard

Use the IsThis function to guard values of this type.

```typescript
Type.IsThis(value)                                   // value is TThis
```