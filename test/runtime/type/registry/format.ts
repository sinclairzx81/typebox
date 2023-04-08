import { FormatRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/FormatRegistry', () => {
  it('Should set format', () => {
    FormatRegistry.Set('test#format1', () => true)
  })
  it('Should get format', () => {
    FormatRegistry.Set('test#format2', () => true)
    const format = FormatRegistry.Get('test#format2')
    Assert.equal(typeof format, 'function')
  })
  it('Should return true if exists', () => {
    FormatRegistry.Set('test#format3', () => true)
    Assert.equal(FormatRegistry.Has('test#format3'), true)
  })
  it('Should clear formats', () => {
    FormatRegistry.Set('test#format4', () => true)
    FormatRegistry.Clear()
    Assert.equal(FormatRegistry.Has('test#format4'), false)
  })
})
