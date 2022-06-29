import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

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
    ok(T, { x: 1, y: 1 })
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
})
