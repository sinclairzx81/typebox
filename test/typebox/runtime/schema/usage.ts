import Value from 'typebox/value'
import Type from 'typebox'

import Schema from 'typebox/schema'
import { Assert } from 'test'

// ------------------------------------------------------------------
// The Schema Submodule is primarily tested via the JSON Schema
// compliance test suite. We add tests here to assert the calling
// interfaces only.
// ------------------------------------------------------------------
const Test = Assert.Context('Schema.Usage:GraphicsModule')

// ------------------------------------------------------------------
// Import
// ------------------------------------------------------------------
type TImport<
  Module extends { $defs: Type.TProperties },
  Ref extends string = Extract<keyof Module['$defs'], string>
> = Module & { $ref: `#/$defs/${Ref}` }
function Import<
  Module extends { $defs: Type.TProperties },
  Ref extends string = Extract<keyof Module['$defs'], string>
>(module: Module, ref: Ref): TImport<Module, Ref> {
  return { ...module, $ref: `#/$defs/${ref}` } as never
}
// ------------------------------------------------------------------
// GraphicsModule
// ------------------------------------------------------------------
const GraphicsModule = {
  $defs: {
    Vector2: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    Vector3: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    }),
    Vertex: Type.Object({
      position: Type.Ref('#/$defs/Vector3'),
      normal: Type.Ref('#/$defs/Vector3'),
      texcoord: Type.Ref('#/$defs/Vector2')
    }),
    Geometry: Type.Object({
      vertices: Type.Array(Type.Ref('#/$defs/Vertex')),
      indices: Type.Array(Type.Integer())
    }),
    Material: Type.Object({
      ambient: Type.Ref('#/$defs/Vector3'),
      diffuse: Type.Ref('#/$defs/Vector3'),
      specular: Type.Ref('#/$defs/Vector3')
    }),
    Mesh: Type.Object({
      geometry: Type.Ref('#/$defs/Geometry'),
      material: Type.Ref('#/$defs/Material')
    })
  }
} as const
// ------------------------------------------------------------------
// Schematics
// ------------------------------------------------------------------
type Vector2 = Type.Static<typeof Vector2>
type Vector3 = Type.Static<typeof Vector3>
type Vertex = Type.Static<typeof Vertex>
type Geometry = Type.Static<typeof Geometry>
type Material = Type.Static<typeof Material>
type Mesh = Type.Static<typeof Mesh>

const Vector2 = Import(GraphicsModule, 'Vector2')
const Vector3 = Import(GraphicsModule, 'Vector3')
const Vertex = Import(GraphicsModule, 'Vertex')
const Geometry = Import(GraphicsModule, 'Geometry')
const Material = Import(GraphicsModule, 'Material')
const Mesh = Import(GraphicsModule, 'Mesh')

// ------------------------------------------------------------------
// Match
// ------------------------------------------------------------------
Test('Should Parse 1', () => {
  Value.Parse(Vector2, { x: 1, y: 2 })
})
Test('Should Parse 2', () => {
  Value.Parse(Vector3, { x: 1, y: 2, z: 3 })
})
Test('Should Parse 3', () => {
  Value.Parse(Vertex, {
    position: { x: 1, y: 2, z: 3 },
    normal: { x: 1, y: 2, z: 3 },
    texcoord: { x: 1, y: 2 }
  })
})
Test('Should Parse 4', () => {
  Value.Parse(Geometry, {
    indices: [0],
    vertices: [{
      position: { x: 1, y: 2, z: 3 },
      normal: { x: 1, y: 2, z: 3 },
      texcoord: { x: 1, y: 2 }
    }]
  })
})
Test('Should Parse 5', () => {
  Value.Parse(Material, {
    ambient: { x: 1, y: 2, z: 3 },
    diffuse: { x: 1, y: 2, z: 3 },
    specular: { x: 1, y: 2, z: 3 }
  })
})
Test('Should Parse 6', () => {
  Value.Parse(Mesh, {
    material: {
      ambient: { x: 1, y: 2, z: 3 },
      diffuse: { x: 1, y: 2, z: 3 },
      specular: { x: 1, y: 2, z: 3 }
    },
    geometry: {
      indices: [0],
      vertices: [{
        position: { x: 1, y: 2, z: 3 },
        normal: { x: 1, y: 2, z: 3 },
        texcoord: { x: 1, y: 2 }
      }]
    }
  })
})
// ------------------------------------------------------------------
// Non-Match
// ------------------------------------------------------------------
Test('Should Not Parse 1', () => {
  Assert.Throws(() => Value.Parse(Vector2, { x: 1, y: 'not-a-number' }))
})
Test('Should Not Parse 2', () => {
  Assert.Throws(() => Value.Parse(Vector3, { x: 1, y: 2, z: 'not-a-number' }))
})
Test('Should Not Parse 3', () => {
  Assert.Throws(() =>
    Value.Parse(Vertex, {
      position: { x: 1, y: 2, z: 3 },
      normal: { x: 1, y: 2, z: 3 },
      texcoord: { x: 1, y: 'not-a-number' }
    })
  )
})
Test('Should Not Parse 4', () => {
  Assert.Throws(() =>
    Value.Parse(Geometry, {
      indices: [0],
      vertices: [{
        position: { x: 1, y: 2, z: 3 },
        normal: { x: 1, y: 2, z: 3 },
        texcoord: { x: 1, y: 'not-a-number' }
      }]
    })
  )
})
Test('Should Not Parse 5', () => {
  Assert.Throws(() =>
    Value.Parse(Material, {
      ambient: { x: 1, y: 2, z: 3 },
      diffuse: { x: 1, y: 2, z: 3 },
      specular: { x: 1, y: 2, z: 'not-a-number' }
    })
  )
})
Test('Should Not Parse 6', () => {
  Assert.Throws(() =>
    Value.Parse(Mesh, {
      material: {
        ambient: { x: 1, y: 2, z: 3 },
        diffuse: { x: 1, y: 2, z: 3 },
        specular: { x: 1, y: 2, z: 3 }
      },
      geometry: {
        indices: [0],
        vertices: [{
          position: { x: 1, y: 2, z: 'not-a-number' },
          normal: { x: 1, y: 2, z: 3 },
          texcoord: { x: 1, y: 2 }
        }]
      }
    })
  )
})
