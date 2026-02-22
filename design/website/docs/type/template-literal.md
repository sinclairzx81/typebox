# Type.TemplateLiteral

Creates a TemplateLiteral type.

## Example

Example usage is shown below.

```typescript
const T = Type.TemplateLiteral('A${"B"|"C"}')        // const T = {
                                                     //   type: 'string',
                                                     //   pattern: '^A(B|C)$'
                                                     // }

type T = Static<typeof T>                            // type T = 'AB' | 'AC'
```

## Guard

Use the IsTemplateLiteral function to guard values of this type.

```typescript
Type.IsTemplateLiteral(value)                       // value is TTemplateLiteral
```