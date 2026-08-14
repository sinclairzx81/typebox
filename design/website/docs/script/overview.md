# Script

TypeScript Syntax Engine For JSON Schema

## Overview

TypeBox includes a runtime TypeScript engine that can transform TypeScript definitions to JSON Schema. The engine is fully type-safe and supports many programmable constructs including Conditional, Mapped, Indexed, Generics, Distributive Generics, and more.

### Example

Syntax highlighting is available via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sinclairzx81.typebox-script).

```typescript
import Type from 'typebox'

// Math Module

const Math = Type.Script(`
  type Vector4 = { x: number, y: number, z: number, w: number }
  type Vector3 = { x: number, y: number, z: number }
  type Vector2 = { x: number, y: number }
`)

// Graphics Module

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
    specular: Vector4
  }
  type Mesh = {
    geometry: Geometry,
    material: Material
  }
`)

type Mesh = Type.Static<typeof Graphics['Mesh']>  // type Mesh = {
                                                  //   geometry: { ... },
                                                  //   material: { ... }
                                                  // }
```