# Script.Options

Script types can be assigned options using the `with` keyword.

## With Keyword

The `with` keyword assigns arbitrary metadata directly to a type.

```typescript
const Email = Type.Script(`string with { format: 'email' }`)

// Produces

const Email = { type: 'string', format: 'email' }
```

The same syntax extends to multiple embedded types within a single declaration.

```typescript
const Vector = Type.Script(`{
  x: number with { minimum: 0, maximum: 1 },
  y: number with { minimum: 0, maximum: 1 },
  z: number with { minimum: 0, maximum: 1 },
} with { additionalProperties: false }`)
```

It works equally well within computed type expressions, such as mapped types.

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

## With Function

The `with` keyword is a syntactic alias for the `With` function.

```typescript
const Email = Type.With(Type.String(), { format: 'email' })
```