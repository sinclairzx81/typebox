import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Date', () => {
  it('Should convert from number', () => {
    const result = Value.Convert(Type.Date(), 123) as Date
    Assert.deepEqual(result.getTime(), 123)
  })
  it('Should convert from numeric string', () => {
    const result = Value.Convert(Type.Date(), '123') as Date
    Assert.deepEqual(result.getTime(), 123)
  })
  it('Should convert from boolean true (interpretted as numeric 1)', () => {
    const result = Value.Convert(Type.Date(), true) as Date
    Assert.deepEqual(result.getTime(), 1)
  })
  it('Should convert from datetime string', () => {
    const result = Value.Convert(Type.Date(), '1980-02-03T01:02:03.000Z') as Date
    Assert.deepEqual(result.toISOString(), '1980-02-03T01:02:03.000Z')
  })
  it('Should convert from datetime string without timezone', () => {
    const result = Value.Convert(Type.Date(), '1980-02-03T01:02:03') as Date
    Assert.deepEqual(result.toISOString(), '1980-02-03T01:02:03.000Z')
  })
  it('Should convert from time with timezone', () => {
    const result = Value.Convert(Type.Date(), '01:02:03.000Z') as Date
    Assert.deepEqual(result.toISOString(), '1970-01-01T01:02:03.000Z')
  })
  it('Should convert from time without timezone', () => {
    const result = Value.Convert(Type.Date(), '01:02:03') as Date
    Assert.deepEqual(result.toISOString(), '1970-01-01T01:02:03.000Z')
  })
  it('Should convert from date string', () => {
    const result = Value.Convert(Type.Date(), '1980-02-03') as Date
    Assert.deepEqual(result.toISOString(), '1980-02-03T00:00:00.000Z')
  })
  it('Should convert invalid strings to unix epoch 0', () => {
    const result = Value.Convert(Type.Date(), 'invalid-date') as Date
    Assert.deepEqual(result, 'invalid-date')
  })
})
