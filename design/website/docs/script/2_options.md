# Script.Options

Script types can be assigned options via the `with` keyword.

## The `with` Keyword

You can assign a script type options using the following

```typescript
const Email = Type.Script(`string with { format: 'email' }`)

// Produces

const Email = { type: 'string', format: 'email' }
```
The `with` keyword allows to assigned to embedded types.

```typescript
const Vector = Type.Script(`{
  x: number with { minimum: 0, maximum: 1 },
  y: number with { minimum: 0, maximum: 1 },
  z: number with { minimum: 0, maximum: 1 },
} with { additionalProperties: false }`)

```
They can also be applied in generic type expressions

```typescript
const { Vector, ClampedVector } = Type.Script(`
  type Vector = {
    x: number
    y: number
    z: number
  }
  
  type Clamp<T> = {
    [K in keyof T]: T[K] with { minimum: 0, maximum: 1 }
  } with { additionalProperties: false }

  type ClampedVector = Clamp<Vector>
`)
```