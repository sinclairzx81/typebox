# Enum

Creates an Enum type.

## Example

Example usage is shown below.

```typescript
const T = Type.Enum(['A', 'B', 'C'])                // const T = {
                                                    //   enum: ['A', 'B', 'C']
                                                    // }

type T = Static<typeof T>                           // type T = 'A' | 'B' | 'C'
```

## Guard

Use the IsEnum function to guard values of this type.

```typescript
Type.IsEnum(value)                                  // value is TEnum
```