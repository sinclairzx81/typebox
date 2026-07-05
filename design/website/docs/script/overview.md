# Script

TypeScript Syntax Engine For JSON Schema

## Overview

TypeBox includes a micro TypeScript scripting engine that can parse TypeScript definitions into JSON Schema. The engine is implemented at runtime as well as statically inside TypeScript's type system, and supports many programmable constructs such as conditional, mapped, indexed, generic, and distributed types, and more.

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
