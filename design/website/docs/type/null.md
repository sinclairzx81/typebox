# Null

Creates a Null type.

## Example

Example usage is shown below.

```typescript
const T = Type.Null()                               // const T = { type: 'null' }

type T = Static<typeof T>                           // type T = null
```

## Guard

Use the IsNull function to guard values of this type.

```typescript
Type.IsNull(value)                                  // value is TNull
```
