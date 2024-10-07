import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Date', () => {
  it('Should use default', () => {
    const T = Type.Date({ default: 1 })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Date({ default: 1 })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1024
  // ----------------------------------------------------------------
  it('Should use value if Date is valid', () => {
    const T = Type.Date({ default: new Date(1) })
    const R = Value.Default(T, new Date(2)) as Date
    Assert.IsEqual(R.getTime(), 2)
  })
  it('Should use default if Date is undefined', () => {
    const T = Type.Date({ default: new Date(1) })
    const R = Value.Default(T, undefined) as Date
    Assert.IsEqual(R.getTime(), 1)
  })
  it('Should use value if Date is invalid', () => {
    const T = Type.Date({ default: new Date(1) })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
})
