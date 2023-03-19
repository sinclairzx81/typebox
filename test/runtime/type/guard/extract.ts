import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TExtract', () => {
  it('Should extract string from number', () => {
    const T = Type.Extract(Type.String(), Type.Number())
    Assert.deepEqual(TypeGuard.TNever(T), true)
  })
  it('Should extract string from string', () => {
    const T = Type.Extract(Type.String(), Type.String())
    Assert.deepEqual(TypeGuard.TString(T), true)
  })
  it('Should extract string | number | boolean from string', () => {
    const T = Type.Extract(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.String())
    Assert.deepEqual(TypeGuard.TString(T), true)
  })
  it('Should extract string | number | boolean from string | boolean', () => {
    const T = Type.Extract(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.Union([Type.String(), Type.Boolean()]))
    Assert.deepEqual(TypeGuard.TUnion(T), true)
    Assert.deepEqual(TypeGuard.TString(T.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TBoolean(T.anyOf[1]), true)
  })
})
