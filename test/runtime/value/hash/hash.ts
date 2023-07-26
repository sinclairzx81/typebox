import * as ValueHash from '@sinclair/typebox/value/hash'
import { Assert } from '../../assert/index'

describe('value/hash/Hash', () => {
  it('Should hash number', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(1))
    const A = ValueHash.Hash(1)
    const B = ValueHash.Hash(2)
    Assert.notEqual(A, B)
  })
  it('Should hash string', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash('hello'))
    const A = ValueHash.Hash('hello')
    const B = ValueHash.Hash('world')
    Assert.notEqual(A, B)
  })
  it('Should hash boolean', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(true))
    Assert.isEqual('bigint', typeof ValueHash.Hash(false))
    const A = ValueHash.Hash(true)
    const B = ValueHash.Hash(false)
    Assert.notEqual(A, B)
  })
  it('Should hash null', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(null))
    const A = ValueHash.Hash(null)
    const B = ValueHash.Hash(undefined)
    Assert.notEqual(A, B)
  })
  it('Should hash array', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash([0, 1, 2, 3]))
    const A = ValueHash.Hash([0, 1, 2, 3])
    const B = ValueHash.Hash([0, 2, 2, 3])
    Assert.notEqual(A, B)
  })
  it('Should hash object 1', () => {
    // prettier-ignore
    Assert.isEqual('bigint', typeof ValueHash.Hash({ x: 1, y: 2 }))
    const A = ValueHash.Hash({ x: 1, y: 2 })
    const B = ValueHash.Hash({ x: 2, y: 2 })
    Assert.notEqual(A, B)
  })
  it('Should hash object 2', () => {
    const A = ValueHash.Hash({ x: 1, y: [1, 2] })
    const B = ValueHash.Hash({ x: 1, y: [1, 3] })
    Assert.notEqual(A, B)
  })
  it('Should hash object 3', () => {
    const A = ValueHash.Hash({ x: 1, y: undefined })
    const B = ValueHash.Hash({ x: 1 })
    Assert.notEqual(A, B)
  })
  it('Should hash object 4', () => {
    const A = ValueHash.Hash({ x: 1, y: new Uint8Array([0, 1, 2]) })
    const B = ValueHash.Hash({ x: 1, y: [0, 1, 2] })
    Assert.notEqual(A, B)
  })
  it('Should hash object 5', () => {
    const A = ValueHash.Hash({ x: 1, y: undefined })
    const B = ValueHash.Hash({ x: 2, y: undefined })
    Assert.notEqual(A, B)
  })
  it('Should hash Date', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(new Date()))
    const A = ValueHash.Hash(new Date(1))
    const B = ValueHash.Hash(new Date(2))
    Assert.notEqual(A, B)
  })
  it('Should hash Uint8Array', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(new Uint8Array([0, 1, 2, 3])))
    const A = ValueHash.Hash(new Uint8Array([0, 1, 2, 3]))
    const B = ValueHash.Hash(new Uint8Array([0, 2, 2, 3]))
    Assert.notEqual(A, B)
  })
  it('Should hash undefined', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(undefined))
    const A = ValueHash.Hash(undefined)
    const B = ValueHash.Hash(null)
    Assert.notEqual(A, B)
  })
  it('Should hash symbol 1', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(Symbol()))
    const A = ValueHash.Hash(Symbol(1))
    const B = ValueHash.Hash(Symbol())
    Assert.notEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(Symbol()))
    const A = ValueHash.Hash(Symbol(1))
    const B = ValueHash.Hash(Symbol(2))
    Assert.notEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(Symbol()))
    const A = ValueHash.Hash(Symbol(1))
    const B = ValueHash.Hash(Symbol(1))
    Assert.isEqual(A, B)
  })
  it('Should hash bigint 1', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(BigInt(1)))
    const A = ValueHash.Hash(BigInt(1))
    const B = ValueHash.Hash(BigInt(2))
    Assert.notEqual(A, B)
  })
  it('Should hash bigint 2', () => {
    Assert.isEqual('bigint', typeof ValueHash.Hash(BigInt(1)))
    const A = ValueHash.Hash(BigInt(1))
    const B = ValueHash.Hash(BigInt(1))
    Assert.isEqual(A, B)
  })
})
