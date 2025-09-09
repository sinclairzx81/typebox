# Call

The Call function invokes Generic type.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below.

```typescript
const G = Type.Generic([
  Type.Parameter('T')
], Type.Array(Type.Ref('T')))

const S = Type.Call(G, [Type.Number()])             // const S: TArray<TNumber>
```

## Guard

Use the IsCall function to guard values of this type.

```typescript
Type.IsCall(value)                                  // value is TCall
```