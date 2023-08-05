import { TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/registry/Type', () => {
  it('Should set type', () => {
    TypeRegistry.Set('test#type1', () => true)
  })
  it('Should get type', () => {
    TypeRegistry.Set('test#type2', () => true)
    const format = TypeRegistry.Get('test#type2')
    Assert.IsEqual(typeof format, 'function')
  })
  it('Should return true if exists', () => {
    TypeRegistry.Set('test#type3', () => true)
    Assert.IsTrue(TypeRegistry.Has('test#type3'))
  })
  it('Should clear types', () => {
    TypeRegistry.Set('test#type4', () => true)
    TypeRegistry.Clear()
    Assert.IsFalse(TypeRegistry.Has('test#type4'))
  })
})
