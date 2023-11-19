import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Date', () => {
  it('Should create value', () => {
    const T = Type.Date()
    const A = Value.Create(T)
    const B = new Date()
    Assert.InRange(A.getTime(), B.getTime(), 1000)
  })
  it('Should create default', () => {
    const T = Type.Date({ default: new Date(1001) })
    const A = Value.Create(T)
    const B = new Date(1001)
    Assert.IsEqual(A, B)
  })
  it('Should create value nested', () => {
    const T = Type.Object({ value: Type.Date() })
    const A = Value.Create(T)
    const B = { value: new Date() }
    Assert.InRange(A.value.getTime(), B.value.getTime(), 1000)
  })
  it('Should create default nested', () => {
    const T = Type.Object({ value: Type.Date({ default: new Date(1001) }) })
    const A = Value.Create(T)
    const B = { value: new Date(1001) }
    Assert.IsEqual(A, B)
  })
})
