import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, StaticDecode, StaticEncode, Static } from '@sinclair/typebox'

const TBItem = Type.Transform(
  Type.Object({
    isHybrid: Type.Boolean(),
  }),
)
  .Decode((value) => ({ isHybrid: value.isHybrid ? 1 : 0 }))
  .Encode((value) => ({ isHybrid: value.isHybrid === 1 ? true : false }))

let decoded = Value.Decode(TBItem, { isHybrid: true })
let encoded = Value.Encode(TBItem, { isHybrid: 1 })
console.log('decoded', decoded)
console.log('encoded', encoded)

const TBIntersect = Type.Intersect([
  Type.Object({
    model: Type.String(),
  }),
  Type.Object({
    features: Type.Array(TBItem),
  }),
])

const aencoded = Value.Encode(TBIntersect, {
  model: 'Prius',
  features: [
    {
      isHybrid: 1,
    },
    {
      isHybrid: 1,
    },
  ],
})

console.log(aencoded)
