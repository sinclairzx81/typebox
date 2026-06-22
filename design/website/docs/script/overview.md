# Script

TypeScript Syntax Engine For JSON Schema

## Overview

TypeBox includes a syntax engine that can transform TypeScript declarations into JSON Schema. The engine is a full syntactic frontend to Type.* and supports many advanced type-level constructs such as Conditional, Mapped, Indexed, Infer, Generics, Distributed types and more. This feature is implemented symmetrically at runtime and statically via TypeScript Template Literal types. 

Syntax highlighting is available via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sinclairzx81.typebox-script)

### Example

The following uses Script to parse TypeScript declarations into JSON Schema.

```typescript
// Module
const Math = Type.Script(`
  type Vector2 = { x: number, y: number }
  type Vector3 = Evaluate<Vector2 & { z: number }>
  type Vector4 = Evaluate<Vector3 & { w: number }>
`)

// Dependent Module
const { Mesh } = Type.Script({ ...Math }, `  
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
    specular: Vector4
  }
  type Mesh = {
    geometry: Geometry,
    material: Material
  }
`)

// Runtime Reflection
Mesh.properties.geometry.properties.vertices.items.properties.position.properties.x
Mesh.properties.geometry.properties.vertices.items.properties.normal.properties.x
Mesh.properties.geometry.properties.vertices.items.properties.uv.properties.x
Mesh.properties.material.properties.diffuse.properties.x
Mesh.properties.material.properties.ambient.properties.x
Mesh.properties.material.properties.specular.properties.x

// Static Inference
function render(mesh: Type.Static<typeof Mesh>) {
  mesh.geometry.vertices[0].position.x
  mesh.geometry.vertices[0].normal.x
  mesh.geometry.vertices[0].uv.x
  mesh.material.diffuse.x
  mesh.material.ambient.x
  mesh.material.specular.x
}
```
