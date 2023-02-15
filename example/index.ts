import { Codegen } from '@sinclair/typebox/codegen'
import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Conditional } from '@sinclair/typebox/conditional'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

const Math = {
  $id: 'https://domain.com/math',
  Vector4: Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
      w: Type.Number(),
    },
    { $id: 'Vector4' },
  ),
  Vector3: Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    },
    { $id: 'Vector3' },
  ),
  Vector2: Type.Object(
    {
      x: Type.Number(),
      y: Type.Number(),
    },
    { $id: '유니코드를 지원해야 합니다' },
  ),
}

const C = TypeCompiler.Compile(Math.Vector2)

console.log(C.Code())

console.log(C.Check({
  x: 1,
  y: 2
}))
