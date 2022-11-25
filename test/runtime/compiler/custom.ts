import { Custom } from '@sinclair/typebox/custom'
import { Type, Kind } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Custom', () => {
  Custom.Set('BigInt', (schema, value) => typeof value === 'bigint')

  it('Should validate bigint', () => {
    const T = Type.Unsafe({ [Kind]: 'BigInt' })
    ok(T, 1n)
  })
  it('Should not validate bigint', () => {
    const T = Type.Unsafe({ [Kind]: 'BigInt' })
    fail(T, 1)
  })
  it('Should validate bigint nested', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'BigInt' }),
    })
    ok(T, { x: 1n })
  })
  it('Should not validate bigint nested', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'BigInt' }),
    })
    fail(T, { x: 1 })
  })
})
