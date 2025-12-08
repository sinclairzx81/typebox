# Schema

Native JSON Schema validation and type inference.

## Example

TypeBox supports user-defined JSON Schema layouts and provides type inference beyond the types available through the Type.* compositors. The following example shows a hypothetical GraphicsModule containing several cross-dependent types that utilize the $defs keyword for reusable schema definitions. The implementation provides a custom import that merges the definitions with a $ref entry point. The type definitions and their corresponding functions are structured symmetrically.

> ⚠️ Native JSON Schema inference and validation is an evolving feature of the TypeBox library. Due to the highly flexible nature of schema layouts, TypeBox cannot provide a simplified interface for every possible layout. Consequently, leveraging native JSON Schema inference may require a moderate level of familiarity with type-level programming concepts.

[GraphicsModule Reference Link](https://www.typescriptlang.org/play/?target=99&module=7&ssl=99&ssc=3&pln=1&pc=1#code/JYWwDg9gTgLgBAFQJ5gKZwGZQiOByGFVAIwgA88AoSgehrgFonmXW32POvufb6EAkuGgwAPAFkIAEwCuAG1QAaOACVUGAHx8+cIZFhwp64ADtgMYBBMBnOITS2sOOAG84AEiMZbAXzjWAYwALVBAAQwsAuDkwpAgZGGsAOh0eNPSMzI5KVDJ9eHt0QWFYUUo4OElZBThcmFQTKVs3T3VrAC5EIiSEAAVsNFhgVF9lctV1WrJ6xttrGChTAHM4AF44AFFpqDCAsQBrVDiMSul5VABtPFbvPABdZXnFkyWtDTW4AApxqvO4ADJXB4oOpOgADADENBu1mhLjUGB8YLgPkoAEocnkRJgZCY9pYTLoSmIfmcanUGk0gTDOsg0D1+hBBhYRiixhUEVMZlSnssPlsFrsDkcICdfgorjD7o8Fss3p8QGTUJ1xUo4CCMJ0EWjaXoRBIlcoEe8XOMQTAZFBCW4krbFdU1e4NeCoTC4RqkSi4GFbCZUAA3VBQSio1JZcMRyPMHQIoMNALKuAAcR2YCCwAC1lV2jocAAMrF4vAMNA4AFsNZrAwjGhGg0CkRDMYzBYrNYw1HO12uJj8mW2-AU2E0xms0qPqaKjTXOMKgA1VB7aAAJlp3QA8sQAFaLmCfScVQ9kNf0gByMhAxCDnzRilnh6QJ9QSXPl+vGMPKNv94XS6gAGYnySTcdz2fd7wqY8ujPC8rygG870-CpH2g59XzghCILgAAvID0Pfe8fG-T8F1gXIgJA3dwKQuBIGscwCSAhFPjwV0vFhX8YGgf88GIpCTGgcI5CY9QWLYtoaE47jeMQpD6jIAIIGgKQRIwMToXYyTdxXGTCL4iok1QHBUAWFC6WfSiwIPT9AyGBMOlQpIAEEoB2JBPnMpJmNYjSJNI+TeP0w9TCkDMRiAly3I87oBBMeolnfD9DyI2SKnECIg2AMJhMcyy92sw8wkvYY4tU9S3SkgDdJo0KMAwGRrETTzvPE7wtL-Higoqaw0ACeQwigMqfIq7SqqClL73EEYggo7cqIKioEuM0yhta2FDOWqAkGqpDwnqRZstW3y2vS-asrkHaKiI8ZUT8H1+xsGBqFzbtXre6NcwAZWCUIIlHb1Gl0EwMDjPFUBzegAHV0ACMJCSMRZA38H69v+uGpDgUwQZBMHMcJGAQkwCA5DkCAAHc+TJ2IO3e2nI2oXI+0KOBKuXD5PM+mA-oCURClFFnRuXLRGexZnKv-dnuk57neaIfnxeFrEDDFoN5Ml+lpciWW0Hl1XckVpnGw2kATK29Xn01jNtaMk5jdNpADdFxtTsy7LzaSS2eb5sUMoOuRHeV53pvdz3rf5qbrCCLRe2xRTHoFv82fWPVYE+IcR0zVVlDwVneJjgw4-mBOuIAj4U73dP00zw18HFvORYLgcBbIsgy+JNPUyrscHWz-zcnrpX4ELwcjJN0y2-yDvhy7rP8Dt0yB77YfKl986J5EKeM+785s5dv3F9jpuI6CdfU8r0dZ7wY+85pum74yHQ52y4ApD+qwIcQQnClsWHCSvWifSNQxlxVCAAhcgcB-TP1fiXdsL174IPSJQUAfYn5yBkOgJwuACBEFIGQGgUD0GoCoJQZeJtI4fDQRgpIvQBqNU+MfZQB49quxygVIqxASowE6G4KCABGZQKFlzKFwnACWPhUqGGAHVBqiZeGdAEXAIRIjOjiMkT1Rc-VBpAn4YIzowicKqLZDdWSS0x5bR4feEKYUHIXAAAwPHvLZSI4U4AXAWrRCA9FWwmB4XAXRSj9EqLEcYmiAkoBCT8QE5RhiQkSKwvJRSykokKL0XANm8TPw+DuDdEMaIgA)



```typescript
import Type from 'typebox'

// ------------------------------------------------------------------------------
// TImport<Module, Ref>
//
// Import definitions types from { $defs } schematic layouts.
// ------------------------------------------------------------------------------
export type TImport<
  Module extends { $defs: Type.TProperties }, 
  Ref extends string = Extract<keyof Module['$defs'], string>
> = (
  Module & { $ref: `#/$defs/${Ref}` }
)
export function Import<
  Module extends { $defs: Type.TProperties }, 
  Ref extends string = Extract<keyof Module['$defs'], string>
>(module: Module, ref: Ref): TImport<Module, Ref> {
  return { ...module, $ref: `#/$defs/${ref}` } as never
}

// ------------------------------------------------------------------------------
// Reference: GraphicsModule
//
// Layout for cross-dependent type definitions
// ------------------------------------------------------------------------------
export const GraphicsModule = {
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
      texcoord: Type.Ref('#/$defs/Vector2'),
    }),
    Geometry: Type.Object({
      vertices: Type.Array(Type.Ref('#/$defs/Vertex')),
      indices: Type.Array(Type.Integer())
    }),
    Material: Type.Object({
      ambient: Type.Ref('#/$defs/Vector3'),
      diffuse: Type.Ref('#/$defs/Vector3'),
      specular: Type.Ref('#/$defs/Vector3'),
    }),
    Mesh: Type.Object({
      geometry: Type.Ref('#/$defs/Geometry'),
      material: Type.Ref('#/$defs/Material'),
    })
  }
} as const

// ------------------------------------------------------------------------------
// Schematics and Inference
//
// We can derive schematics and inference in the following way
// ------------------------------------------------------------------------------

export type Vector2 = Type.Static<typeof Vector2>
export type Vector3 = Type.Static<typeof Vector3>
export type Vertex = Type.Static<typeof Vertex>
export type Geometry = Type.Static<typeof Geometry>
export type Material = Type.Static<typeof Material>
export type Mesh = Type.Static<typeof Mesh>

export const Vector2 = Import(GraphicsModule, 'Vector2')
export const Vector3 = Import(GraphicsModule, 'Vector3')
export const Vertex = Import(GraphicsModule, 'Vertex')
export const Geometry = Import(GraphicsModule, 'Geometry')
export const Material = Import(GraphicsModule, 'Material')
export const Mesh = Import(GraphicsModule, 'Mesh')

// ------------------------------------------------------------------------------
// Validation
//
// The types can be passed to TypeBox validators
// ------------------------------------------------------------------------------
import Value from 'typebox/value'

const mesh = Value.Parse(Mesh, {
  material: {
    ambient: { x: 1, y: 2, z: 3 },
    diffuse: { x: 1, y: 2, z: 3 },
    specular: { x: 1, y: 2, z: 3 },
  },
  geometry: {
    indices: [0],
    vertices: [{
      position: { x: 1, y: 2, z: 3 },
      normal: { x: 1, y: 2, z: 3 },
      texcoord: { x: 1, y: 2 },
    }]
  }
})
```