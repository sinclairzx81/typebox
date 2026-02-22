# Type.Any

Creates an Any type.

## Example

Example usage is shown below.

```typescript
const T = Type.Any()                                // const T = {}

type T = Static<typeof T>                           // type T = any
```

## Guard

Use the IsAny function to guard values of this type.

```typescript
Type.IsAny(value)                                  // value is TAny
```