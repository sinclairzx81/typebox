# Type.Identifier

Creates a named Identifier.

> ⚠️ This function is a Script evalutation action.

## Example

Example usage is shown below. 

```typescript
const T = Type.Identifier('A')                      // const T = {
                                                    //  type: 'identifier',
                                                    //  name: 'A'
                                                    // }
```

## Guard

Use the IsIdentifier function to guard values of this type.

```typescript
Type.IsIdentifier(value)                           // value is TIdentifier
```
