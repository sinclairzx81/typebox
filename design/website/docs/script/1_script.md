# Script

The Script function will transform TypeScript types into Json Schema schematics.

## Type Expressions

The Script function can accept anonymous TypeScript type expressions.

```typescript
const A = Type.Script('"hello"')

const B = Type.Script(`{
  x: number
  y: number
  z: number
}`)

const C = Type.Script(`
{ x: number } & (
  { y: number } | 
  { z: number }
)`)

```

## Type Alias and Interface

The Script function also accepts `type` and `interface` declarations. The return value will be an object containing all embedded declarations.

```typescript
const { Expression, ConstDeclaration, BinaryExpression, ConstExpression } = Type.Script(`
  type Expression = 
    | ConstDeclaration
    | BinaryExpression
    | ConstExpression

  interface ConstDeclaration {
    type: 'ConstDeclaration',
    name: string
    value: Expression
  }
  interface BinaryExpression {
    type: 'BinaryExpression'
    left: Expression
    right: Expression
  }
  interface ConstExpression {
    type: 'ConstExpression'
    const: unknown
  }
`)

```

# Unsupported

The following constructs are currently unsupported.

### Template Literal Substring Infer

Script does not support substring inference with TemplateLiteral types.

```typescript
type Get<S extends string> = S extends `hello ${infer Name}` ? Name : never
//                                             ^
//                                             Substring Infer Not Supported
```

### Embedded Function with Generic Type Parameter

Script does not support embedded function types with generic type parameters.

```typescript
type Foo = { x: <T>(value: T) => string }
//              ^ 
//              Embedded Generic Function Not Supported
```