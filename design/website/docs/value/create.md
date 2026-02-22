# Value.Create

The Create function will create an instance of the given type.

## Example

Example usage is shown below.

```typescript
const T = Type.Object({
  x: Type.Number({ default: 42 }),
  y: Type.Number(),
  z: Type.Number()
})

const A = Value.Create(T)                            // const A = { 
                                                     //   x: 42, 
                                                     //   y: 0, 
                                                     //   z: 0 
                                                     // }
```


## Ambiguous Constraints

The Create function will consider an operation ambiguous if the type being created includes constraints that could produce an invalid value. For example, applying a `format` constraint to a String type is considered ambiguous, as the Create function cannot determine what kind of format it should generate.

```typescript
const T = Type.String({ 
  format: 'email' 
})

const A = Value.Create(T)                            // throws CreateError
```

To fix, apply a `default` annotation to the type.

```typescript
const T = Type.String({ 
  format: 'email', 
  default: 'user@domain.com' 
})

const A = Value.Create(T)                            // const A: string = 'user@domain.com'
```