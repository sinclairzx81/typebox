import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Record', () => {
  it('Should convert record value to numeric', () => {
    const T = Type.Record(Type.String(), Type.Number())
    const V = Value.Convert(T, { x: '42', y: '24', z: 'hello' })
    Assert.IsEqual(V, { x: 42, y: 24, z: 'hello' })
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/930
  // ----------------------------------------------------------------
  it('Should convert record union 1', () => {
    const T = Type.Union([Type.Null(), Type.Record(Type.Number(), Type.Any())])
    const V = Value.Convert(T, {})
    Assert.IsEqual(V, {})
  })
  it('Should convert record union 2', () => {
    const T = Type.Union([Type.Record(Type.Number(), Type.Any()), Type.Null()])
    const V = Value.Convert(T, {})
    Assert.IsEqual(V, {})
  })
  it('Should convert record union 3', () => {
    const T = Type.Union([Type.Null(), Type.Record(Type.Number(), Type.Any())])
    const V = Value.Convert(T, null)
    Assert.IsEqual(V, null)
  })
  it('Should convert record union 4', () => {
    const T = Type.Union([Type.Record(Type.Number(), Type.Any()), Type.Null()])
    const V = Value.Convert(T, null)
    Assert.IsEqual(V, null)
  })
  it('Should convert record union 5', () => {
    const T = Type.Union([Type.Null(), Type.Record(Type.Number(), Type.Any())])
    const V = Value.Convert(T, 'NULL')
    Assert.IsEqual(V, null)
  })
  it('Should convert record union 6', () => {
    const T = Type.Union([Type.Record(Type.Number(), Type.Any()), Type.Null()])
    const V = Value.Convert(T, 'NULL')
    Assert.IsEqual(V, null)
  })
})
