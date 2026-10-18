# Type.Cyclic

Creates a `Cyclic` type. A `Cyclic` is a self-contained schema for potentially recursive types. It holds one or more named definitions in a `$defs` map and uses a `$ref` to select the root definition. Because references resolve against these definitions, a definition can refer to itself or another definition without depending on an external schema. `Cyclic` types are typically produced by `Script` when a declaration is recursive, but can also be created directly with `Cyclic`.

## Example

Example usage is shown below.

```typescript
const T = Type.Cyclic({                             // const T = {
  A: Type.Object({                                  //   '$defs': {
    x: Type.Array(Type.Ref('A')),                   //     A: {
  }),                                               //       type: 'object',
}, 'A')                                             //       required: [ 'x' ],
                                                    //       properties: {
                                                    //         x: {
                                                    //           type: 'array',
                                                    //           items: {
                                                    //             '$ref': 'A'
                                                    //           }
                                                    //         }
                                                    //       },
                                                    //       '$id': 'A'
                                                    //     }
                                                    //   },
                                                    //   '$ref': 'A'
                                                    // }

type T = Static<typeof T>                           // type T = { x: ...[] }
```

## Guard

Use the `IsCyclic` function to guard values of this type.

```typescript
Type.IsCyclic(value)                                // value is TCyclic
```

## Declarations

The Cyclic type is a container that bundles a recursive type with the definitions it depends on, producing a self-contained schema. It is intended to be the result structure for multi-type declarations, where one declaration may depend on another. This ensures each returned schema is self-contained, meaning all of its references resolve within the type itself.

The need for `Cyclic` is easiest to explain with an example. Consider the following two declarations: `Vector` is acyclic and has no dependencies, while `Node` is recursive and depends on `Vector`. Note that `Node` is inferred as a `TCyclic` to ensure it is self-contained.

```typescript
import Type from 'typebox'

// Each declaration is returned as a standalone type
const { Vector, Node } = Type.Script(`
  type Vector = {
    x: number
    y: number
    z: number
  }
  type Node = {
    id: string
    value: Vector
    nodes: Node[]   // <-- Node is recursive, so it infers as TCyclic
  }
`)
```

### Vector

The Vector type is acyclic and has no dependencies, so it can be returned as is.

```typescript
const Vector: Type.TObject<{
  x: Type.TNumber;
  y: Type.TNumber;
  z: Type.TNumber;
}>
```

### Node

The `Node` type references itself and depends on `Vector`, so it must be transformed into a `TCyclic` to be self-contained. The `Vector` dependency is collected and included as a definition within the `TCyclic`, and references inside `Node` resolve against those definitions. The second type argument (`"Node"`) identifies the root definition.

```typescript
const Node: Type.TCyclic<{
  Node: Type.TObject<{
    id: Type.TString;
    nodes: Type.TArray<Type.TRef<"Node">>;
    value: Type.TRef<"Vector">;
  }>;
  Vector: Type.TObject<{
    x: Type.TNumber;
    y: Type.TNumber;
    z: Type.TNumber;
  }>;
}, "Node">
```

## Embedding

The output structure of a `TCyclic` is a flat `$defs` and `$ref` structure. It can safely reference only structures downstream of itself, and it has no information about potential parent types. Because of this, embedding a `Cyclic` in an enclosing type is generally considered unsafe.

### Unsafe

Here, the `Node` type produces a `Cyclic`, which we embed in a parent `Container` type. This composition works in this example, but it is not always safe: duplicate or overridden `$id` values can cause references to resolve to the wrong target. We therefore consider this embedding unsafe.

```typescript
const { Node } = Type.Script(`
  type Node = {
    id: string
    nodes: Node[]
  }
`)

// Unsafe Embedding
const Container = Type.Object({ node: Node })
// const Container = {
//   type: 'object',
//   required: [ 'node' ],
//   properties: {
//     node: {
//       '$defs': {
//         Node: {
//           type: 'object',
//           required: [ 'id', 'nodes' ],
//           properties: {
//             id: { type: 'string' },
//             nodes: { type: 'array', items: { '$ref': 'Node' } }
//           },
//           '$id': 'Node'
//         }
//       },
//       '$ref': 'Node'
//     }
//   }
// }
```

### Safe

If the `Container` type is declared in the same multi-type declaration as `Node`, TypeBox can reason about the relationship between them. In the following example, `Node` is recursive, which implicitly makes `Container` a `Cyclic` as well.

```typescript
const { Container } = Type.Script(`
  type Node = {
    id: string
    nodes: Node[]
  }

  // Safe
  type Container = {
    node: Node
  }
`)
// const Container = {
//   '$defs': {
//     Node: {
//       type: 'object',
//       required: [ 'id', 'nodes' ],
//       properties: {
//         id: { type: 'string' },
//         nodes: { type: 'array', items: { '$ref': 'Node' } }
//       },
//       '$id': 'Node'
//     },
//     Container: {
//       type: 'object',
//       required: [ 'node' ],
//       properties: { node: { '$ref': 'Node' } },
//       '$id': 'Container'
//     }
//   },
//   '$ref': 'Container'
// }
```

## Recommendation

If you need to use `Cyclic` types manually to express recursion, the `Cyclic` type should always be the outermost type, and it should contain definitions for every type it depends on or references. This keeps the schema self-contained and avoids the embedding problems described above. In the following example, `Expression` is the root definition. `BinaryExpression` refers back to `Expression`, which makes the type recursive, and the literal and operator types are included as definitions within the same `Cyclic`.

```typescript
import Type from 'typebox'

type Expression = Type.Static<typeof Expression>

// Include definitions for every type required by this Cyclic.
const Expression = Type.Cyclic({
  BooleanLiteral: Type.Object({
    type: Type.Literal('BooleanLiteral'),
    value: Type.Boolean()
  }),
  NumberLiteral: Type.Object({
    type: Type.Literal('NumberLiteral'),
    value: Type.Number()
  }),
  Literal: Type.Union([
    Type.Ref('BooleanLiteral'),
    Type.Ref('NumberLiteral'),
  ]),
  Operator: Type.Union([
    Type.Literal('+'),
    Type.Literal('-'),
    Type.Literal('*'),
    Type.Literal('/'),
  ]),
  BinaryExpression: Type.Object({
    type: Type.Literal('BinaryExpression'),
    operator: Type.Ref('Operator'),
    left: Type.Ref('Expression'),
    right: Type.Ref('Expression'),
  }),
  Expression: Type.Union([
    Type.Ref('Literal'),
    Type.Ref('BinaryExpression'),
  ]),
}, 'Expression')
```