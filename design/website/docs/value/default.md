# Value.Default

The Default function automatically generates values for any missing properties or elements whose type includes a default annotation. If no such annotation exists, the function will not generate a value. This function is most commonly used in HTTP request pipelines to provide reasonable defaults for optional, user-defined properties.

> ⚠️ The Default function may return invalid data if the provided value is itself invalid. This function does not perform any checks on the value to ensure the data is correct. The function returns `unknown` and therefore results should be checked before use.

## Example

Example usage is shown below.

```typescript
const Pagination = Type.Object({ 
  skip: Type.Optional(Type.Number({ default: 0 })), 
  take: Type.Optional(Type.Number({ default: 10 })) 
})

const A = Value.Default(Pagination, {})             // const A = { skip: 0, take: 10 }

const B = Value.Default(Pagination, { skip: 10 })   // const B = { skip: 10, take: 10 }

const C = Value.Default(Pagination, { take: 100 })  // const C = { skip: 0, take: 100 }
```