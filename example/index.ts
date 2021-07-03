import { Type, Static, TObject, TProperties } from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv        from 'ajv'

const ajv = addFormats(new Ajv(), [
  'date-time', 
  'time', 
  'date', 
  'email',  
  'hostname', 
  'ipv4', 
  'ipv6', 
  'uri', 
  'uri-reference', 
  'uuid',
  'uri-template', 
  'json-pointer', 
  'relative-json-pointer', 
  'regex'
])
.addKeyword('kind')
.addKeyword('modifier')

// -----------------------------------------------
// npm start to run example
// -----------------------------------------------

// Related Types
const Vector2 = Type.Object({ x: Type.Number(), y: Type.Number() })
const Vector3 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() })
const Vector4 = Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number(), w: Type.Number() })
const Math3D  = Type.Box('math3d', { Vector2, Vector3, Vector4 })

// Dependent Type
const Vertex = Type.Object({
    position:  Type.Ref(Math3D, 'Vector4'),
    normal:    Type.Ref(Math3D, 'Vector3'),
    uv:        Type.Ref(Math3D, 'Vector2'),
})


console.log(JSON.stringify(Math3D, null, 2))
console.log(JSON.stringify(Vertex, null, 2))

ajv.addSchema(Math3D)
console.log(ajv.validate(Vertex, {
    position: {x: 1, y: 1, z: 1, w: 1},
    normal: {x: 1, y: 1, z: 1},
    uv: {x: 1, y: 1},
}))


