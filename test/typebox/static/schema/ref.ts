import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// ------------------------------------------------------------------
// Object Ref 1
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    $defs: {
      address: { type: 'string' }
      count: { type: 'number' }
      user: {
        type: 'object'
        required: ['address', 'count']
        properties: {
          address: { $ref: '#/$defs/address' }
          count: { $ref: '#/$defs/count' }
        }
      }
    }
    $ref: '#/$defs/user'
  }>,
  {
    count: number
    address: string
  }
>(true)
// ------------------------------------------------------------------
// Object Ref 2
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    $defs: {
      address: { type: 'string' }
      count: { type: 'number' }
    }
    type: 'object'
    required: ['address', 'count']
    properties: {
      address: { $ref: '#/$defs/address' }
      count: { $ref: '#/$defs/count' }
    }
  }>,
  {
    count: number
    address: string
  }
>(true)

// ------------------------------------------------------------------
// Mesh
// ------------------------------------------------------------------
type Mesh = XStatic<{
  $defs: {
    float: { type: 'number' }
    vector2: {
      type: 'object'
      required: ['x', 'y']
      properties: {
        x: { $ref: '#/$defs/float' }
        y: { $ref: '#/$defs/float' }
      }
    }
    vector3: {
      type: 'object'
      required: ['x', 'y', 'z']
      properties: {
        x: { $ref: '#/$defs/float' }
        y: { $ref: '#/$defs/float' }
        z: { $ref: '#/$defs/float' }
      }
    }
    vertex: {
      type: 'object'
      required: ['position', 'normal', 'texcoord']
      properties: {
        position: { $ref: '#/$defs/vector3' }
        normal: { $ref: '#/$defs/vector3' }
        texcoord: { $ref: '#/$defs/vector2' }
      }
    }
    material: {
      type: 'object'
      required: ['diffuse', 'ambient', 'specular']
      properties: {
        diffuse: { $ref: '#/$defs/vector3' }
        ambient: { $ref: '#/$defs/vector3' }
        specular: { $ref: '#/$defs/vector3' }
      }
    }
    geometry: {
      type: 'object'
      required: ['vertices', 'indices']
      properties: {
        vertices: { type: 'array'; items: { $ref: '#/$defs/vertex' } }
        indices: { type: 'array'; items: { $ref: '#/$defs/float' } }
      }
    }
    'mesh': {
      type: 'object'
      required: ['material', 'geometry']
      properties: {
        material: { $ref: '#/$defs/material' }
        geometry: { $ref: '#/$defs/geometry' }
      }
    }
  }
  $ref: '#/$defs/mesh'
}>
Assert.IsExtendsMutual<Mesh, {
  material: {
    diffuse: {
      x: number
      y: number
      z: number
    }
    ambient: {
      x: number
      y: number
      z: number
    }
    specular: {
      x: number
      y: number
      z: number
    }
  }
  geometry: {
    vertices: {
      position: {
        x: number
        y: number
        z: number
      }
      normal: {
        x: number
        y: number
        z: number
      }
      texcoord: {
        x: number
        y: number
      }
    }[]
    indices: number[]
  }
}>(true)
// ------------------------------------------------------------------
// Recursive 1
// ------------------------------------------------------------------
type Recursive1 = XStatic<{
  $defs: {
    node: {
      type: 'object'
      required: ['id', 'nodes']
      properties: {
        id: { type: 'string' }
        nodes: { $ref: '#/$defs/node' }
      }
    }
  }
  $ref: '#/$defs/node'
}>
Assert.IsExtendsMutual<Recursive1, {
  id: string
  nodes: {
    id: string
    nodes: {
      id: string
      nodes: any // terminated
    }
  }
}>(true)
// ------------------------------------------------------------------
// Recursive 2
// ------------------------------------------------------------------
type Recursive2 = XStatic<{
  type: 'object'
  required: ['id', 'nodes']
  properties: {
    id: { type: 'string' }
    nodes: { $ref: '#' }
  }
}>
Assert.IsExtendsMutual<Recursive2, {
  id: string
  nodes: {
    id: string
    nodes: {
      id: string
      nodes: {
        id: string
        nodes: any // terminated - one more due to non-immediate ref
      }
    }
  }
}>(true)
// ------------------------------------------------------------------
// Escape 1
// ------------------------------------------------------------------
type Escape1 = XStatic<{
  $defs: {
    'tar~get': {
      const: 'hello'
    }
  }
  $ref: '#/$defs/tar~0get'
}>
Assert.IsExtendsMutual<Escape1, 'hello'>(true)
// ------------------------------------------------------------------
// Escape 2
// ------------------------------------------------------------------
type Escape2 = XStatic<{
  $defs: {
    'tar/get': {
      const: 'world'
    }
  }
  $ref: '#/$defs/tar~1get'
}>
Assert.IsExtendsMutual<Escape2, 'world'>(true)
