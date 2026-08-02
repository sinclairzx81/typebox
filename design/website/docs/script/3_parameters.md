# Script.Parameters

Scripts can be parameterized using a leading context object, where each key is a referable type name. This can be used to pass exterior types into Script.

### Parameters

The following creates a nullable string by passing an exterior string into the Script.

```typescript
const T = Type.String()

const S = Type.Script({ T }, `T | null`)            // const S: TUnion<[
                                                    //   TString,
                                                    //   TNull
                                                    // ]>
```

Multiple exterior types can be passed via the context object.

```typescript
const A = Type.Literal(1)
const B = Type.Literal(2)
const C = Type.Literal(3)

const T = Type.Script({ A, B, C }, `[A, B, C]`)     // const T: TTuple<[
                                                    //   TLiteral<1>,
                                                    //   TLiteral<2>,
                                                    //   TLiteral<3>
                                                    // ]>
```

### Module Dependencies

Script modules can be passed as the context for other modules, allowing type definitions to be shared across dependent modules.

```typescript
import Type from 'typebox'

const Math = Type.Script(`
  type Vector4 = { x: number, y: number, z: number, w: number }
  type Vector3 = { x: number, y: number, z: number }
  type Vector2 = { x: number, y: number }
`)

const Graphics = Type.Script(Math, `
  type Vertex = {
    position: Vector4,
    normal: Vector3,
    uv: Vector2
  }
  type Geometry = {
    vertices: Vertex[],
    indices: number[]
  }
  type Material = {
    ambient: Vector4,
    diffuse: Vector4,
    specular: Vector4,
  }
  type Mesh = {
    geometry: Geometry
    material: Material
  }
`)

type Mesh = Type.Static<typeof Graphics['Mesh']>     // type Mesh = {
                                                     //   geometry: { ... },
                                                     //   material: { ... }
                                                     // }
```