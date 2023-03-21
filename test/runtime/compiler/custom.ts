import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/Custom', () => {
  TypeRegistry.Set('BigInt', (schema, value) => typeof value === 'bigint')
  it('Should validate bigint', () => {
    const T = Type.Unsafe({ [Kind]: 'BigInt' })
    Ok(T, 1n)
  })
  it('Should not validate bigint', () => {
    const T = Type.Unsafe({ [Kind]: 'BigInt' })
    Fail(T, 1)
  })
  it('Should validate bigint nested', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'BigInt' }),
    })
    Ok(T, { x: 1n })
  })
  it('Should not validate bigint nested', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'BigInt' }),
    })
    Fail(T, { x: 1 })
  })
})
