import { FormatRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/registry/Format', () => {
  it('Should set format', () => {
    FormatRegistry.Set('test#format1', () => true)
  })
  it('Should get format', () => {
    FormatRegistry.Set('test#format2', () => true)
    const format = FormatRegistry.Get('test#format2')
    Assert.IsEqual(typeof format, 'function')
  })
  it('Should return true if exists', () => {
    FormatRegistry.Set('test#format3', () => true)
    Assert.IsTrue(FormatRegistry.Has('test#format3'))
  })
  it('Should clear formats', () => {
    FormatRegistry.Set('test#format4', () => true)
    FormatRegistry.Clear()
    Assert.IsFalse(FormatRegistry.Has('test#format4'))
  })
})
