# Void

Creates a Void type.

> ⚠️ This is type is cannot be expressed with Json. Do not use if publishing types for other languages to consume.

## Example

Example usage is shown below.

```typescript
const T = Type.Void()                               // const T = { type: 'void' }

type T = Static<typeof T>                           // type T = void
```

## Guard

Use the IsVoid function to guard values of this type.

```typescript
Type.IsVoid(value)                                  // value is TVoid
```