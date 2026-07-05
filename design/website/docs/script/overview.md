# Script

TypeScript Syntax Engine For JSON Schema

## Overview

TypeBox includes a runtime scripting engine that can transform TypeScript definitions into JSON Schema. The engine is implemented symmetrically at runtime and inside TypeScript's type system. It supports many programmable type-level constructs such as Conditional, Mapped, Indexed, Generic, Distributive Conditional, and more. The engine is designed for TypeScript 7 but is supported in TypeScript 5 and above.

### Example

Syntax highlighting is available via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sinclairzx81.typebox-script)

```typescript
// Module
const Math = Type.Script(`
  type Vector2 = { x: number, y: number }
  type Vector3 = { x: number, y: number, z: number }
  type Vector4 = { x: number, y: number, z: number, w: number }
`)

// Dependent Module
const { Mesh } = Type.Script(Math, `  
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
