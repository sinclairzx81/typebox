import { Type, Kind } from '@sinclair/typebox'
import { Ok, Fail } from './validate'
import { deepEqual, strictEqual } from 'assert'

describe('type/compiler/Omit', () => {
  it('Should omit properties on the source schema', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, ['z'])
    Ok(T, { x: 1, y: 1 })
  })

  it('Should remove required properties on the target schema', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, ['z'])
    strictEqual(T.required!.includes('z'), false)
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
    const T = Type.Omit(A, ['z'])
    strictEqual(A.additionalProperties, false)
    strictEqual(T.additionalProperties, false)
  })

  it('Should omit with keyof object', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    })
    const B = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const T = Type.Omit(A, Type.KeyOf(B), { additionalProperties: false })
    Ok(T, { z: 0 })
    Fail(T, { x: 0, y: 0, z: 0 })
  })
  it('Should support Omit of Literal', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, Type.Literal('x'))
    Ok(T, { y: 1, z: 1 })
    Fail(T, { x: 1, y: 1, z: 1 })
  })
  it('Should support Omit of Never', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const T = Type.Omit(A, Type.Never())
    Fail(T, { y: 1, z: 1 })
    Ok(T, { x: 1, y: 1, z: 1 })
  })
})
