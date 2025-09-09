# Parameter

Creates a Generic Parameter type.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below.

```typescript
const T = Type.Parameter('A',                       // const T = {
  Type.Number(),                                    //   type: 'parameter',
  Type.Literal(1)                                   //   name: 'A',
)                                                   //   extends: { type: 'number' },
                                                    //   equals: { const: 1 }
                                                    // }

type T = Static<typeof T>                           // type T = unknown
``` 

## Guard

Use the IsParameter function to guard values of this type.

```typescript
Type.IsParameter(value)                             // value is TParameter
```