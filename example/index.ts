import { Codegen } from '@sinclair/typebox/codegen'
import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Conditional } from '@sinclair/typebox/conditional'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

const Vector = Type.Object(
  {
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
  },
  {
    $id: 'http://domain.com/schemas/Vector',
  },
)

const C = TypeCompiler.Compile(Vector)

console.log(C.Code())

// function check_http_58_47_47_domain_46_com_47_schemas_47_Vector(value) {
//   return (
//     (typeof value === 'object' && value !== null && !Array.isArray(value)) &&
//     (typeof value.x === 'number' && !isNaN(value.x)) &&
//     (typeof value.y === 'number' && !isNaN(value.y)) &&
//     (typeof value.z === 'number' && !isNaN(value.z))
//  )
// }
// return function check(value) {
//   return (
//     (check_http_58_47_47_domain_46_com_47_schemas_47_Vector(value))
//  )
// }

console.log(String.fromCharCode(58)) // :
console.log(String.fromCharCode(47)) // /
console.log(String.fromCharCode(47)) // /
console.log(String.fromCharCode(46)) // .
