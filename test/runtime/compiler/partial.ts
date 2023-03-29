import { TypeSystem } from '@sinclair/typebox/system'
import { Type, Kind, Modifier } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { strictEqual } from 'assert'

describe('type/compiler/Partial', () => {
  it('Should convert a required object into a partial.', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Partial(A)
    Ok(T, { x: 1, y: 1, z: 1 })
    Ok(T, { x: 1, y: 1 })
    Ok(T, { x: 1 })
    Ok(T, {})
  })

  it('Should update modifier types correctly when converting to partial', () => {
    const A = Type.Object(
      {
        x: Type.ReadonlyOptional(Type.Number()),
        y: Type.Readonly(Type.Number()),
        z: Type.Optional(Type.Number()),
        w: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Partial(A)
    strictEqual(T.properties.x[Modifier], 'ReadonlyOptional')
    strictEqual(T.properties.y[Modifier], 'ReadonlyOptional')
    strictEqual(T.properties.z[Modifier], 'Optional')
    strictEqual(T.properties.w[Modifier], 'Optional')
  })

  it('Should inherit options from the source object', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Partial(A)
    strictEqual(A.additionalProperties, false)
    strictEqual(T.additionalProperties, false)
  })
  it('Should support partial properties of raw TUnsafe', () => {
    // https://github.com/sinclairzx81/typebox/issues/364
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ x: 1 }) }))
    strictEqual(T.required, undefined)
  })
  it('Should not support partial properties of unknown TUnsafe', () => {
    // https://github.com/sinclairzx81/typebox/issues/364
    const T = Type.Partial(Type.Object({ x: Type.Unsafe({ [Kind]: 'UnknownPartialType', x: 1 }) }))
    strictEqual(T.required![0], 'x')
  })
  it('Should support partial properties of custom TUnsafe', () => {
    // https://github.com/sinclairzx81/typebox/issues/364
    const U = TypeSystem.Type('CustomPartialType', () => true)
    const T = Type.Partial(Type.Object({ x: U() }))
    strictEqual(T.required, undefined)
  })
})
