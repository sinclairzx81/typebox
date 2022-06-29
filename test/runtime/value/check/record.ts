import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Record', () => {
  it('Should pass record', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
        z: 3,
      },
    }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail record with missing property', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
      },
    }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail record with invalid property', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
        z: '3',
      },
    }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should pass record with optional property', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Optional(Type.Number()),
      }),
    )
    const value = {
      position: {
        x: 1,
        y: 2,
      },
    }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
})
