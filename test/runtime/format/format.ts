import { Format } from '@sinclair/typebox/format'
import { Assert } from '../assert/index'

describe('format/Format', () => {
  it('Should set format', () => {
    Format.Set('test#format1', () => true)
  })

  it('Should get format', () => {
    Format.Set('test#format2', () => true)
    const format = Format.Get('test#format2')
    Assert.equal(typeof format, 'function')
  })

  it('Should return true if exists', () => {
    Format.Set('test#format3', () => true)
    Assert.equal(Format.Has('test#format3'), true)
  })

  it('Should clear formats', () => {
    Format.Set('test#format4', () => true)
    Format.Clear()
    Assert.equal(Format.Has('test#format4'), false)
  })
})
