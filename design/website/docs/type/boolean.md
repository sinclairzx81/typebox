# Type.Boolean

Create a Boolean type.

## Example

Example usage is shown below.

```typescript
const T = Type.Boolean()                            // const T = { type: 'boolean' }

type T = Static<typeof T>                           // type T = boolean
```

## Guard

Use the IsBoolean function to guard values of this type.

```typescript
Type.IsBoolean(value)                               // value is TBoolean
```

