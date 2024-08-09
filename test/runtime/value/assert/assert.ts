import { Value, AssertError } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/Assert', () => {
  it('Should Assert', () => {
    Assert.Throws(() => Value.Assert(Type.String(), 1))
  })
  it('Should throw AssertError', () => {
    try {
      Value.Assert(Type.String(), 1)
    } catch (error) {
      if (error instanceof AssertError) {
        return
      }
      throw error
    }
  })
  it('Should throw AssertError and produce Iterator', () => {
    try {
      Value.Assert(Type.String(), 1)
    } catch (error) {
      if (error instanceof AssertError) {
        const first = error.Errors().First()
        Assert.HasProperty(first, 'type')
        Assert.HasProperty(first, 'schema')
        Assert.HasProperty(first, 'path')
        Assert.HasProperty(first, 'value')
        Assert.HasProperty(first, 'message')
        return
      }
      throw error
    }
  })
})
