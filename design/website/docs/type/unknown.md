# Unknown

Creates an Unknown type.

## Example

Example usage is shown below.

```typescript
const T = Type.Unknown()                            // const T = { }

type T = Static<typeof T>                           // type T = unknown
```

## Guard

Use the IsUnknown function to guard values of this type.

```typescript
Type.IsUnknown(value)                               // value is TUnknown
```