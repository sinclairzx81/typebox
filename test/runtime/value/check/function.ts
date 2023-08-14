import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Function', () => {
  it('Should validate function 1', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    Assert.IsTrue(Value.Check(T, function () {}))
  })
  it('Should validate function 2', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    // note: validation only checks typeof 'function'
    Assert.IsTrue(Value.Check(T, function (a: string, b: string, c: string, d: string) {}))
  })
  it('Should validate function 3', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    // note: validation only checks typeof 'function'
    Assert.IsTrue(
      Value.Check(T, function () {
        return 'not-a-number'
      }),
    )
  })
  it('Should not validate function', () => {
    const T = Type.Function([Type.Number()], Type.Number())
    Assert.IsFalse(Value.Check(T, 1))
  })
})
