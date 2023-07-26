import { Type } from '@sinclair/typebox'
import { Errors } from '@sinclair/typebox/errors'
import { Assert } from '../assert'

describe('errors/ValueErrorIterator', () => {
  it('Should return undefined for non error', () => {
    const R = Errors(Type.Number(), [], 1).First()
    Assert.isEqual(R, undefined)
  })
  it('Should return a value error when error', () => {
    const { type, path, message } = Errors(Type.Number(), [], '').First()!
    Assert.isTypeOf(type, 'number')
    Assert.isTypeOf(path, 'string')
    Assert.isTypeOf(message, 'string')
  })
  it('Should yield empty array for non error', () => {
    const R = [...Errors(Type.Number(), [], 1)]
    Assert.isEqual(R.length, 0)
  })
  it('Should yield array with 1 error when error', () => {
    const R = [...Errors(Type.Number(), [], 'foo')]
    Assert.isEqual(R.length, 1)
  })
  it('Should yield array with N errors when error', () => {
    // prettier-ignore
    const R = [...Errors(Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }), [], {})] // require object to invoke internal check
    Assert.isEqual(R.length > 1, true)
  })
})
