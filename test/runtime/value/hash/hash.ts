import * as ValueHash from '@sinclair/typebox/value/hash'
import { Assert } from '../../assert/index'

describe('value/hash/Hash', () => {
  it('Should hash number', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(1))
    const A = ValueHash.Hash(1)
    const B = ValueHash.Hash(2)
    Assert.NotEqual(A, B)
  })
  it('Should hash string', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash('hello'))
    const A = ValueHash.Hash('hello')
    const B = ValueHash.Hash('world')
    Assert.NotEqual(A, B)
  })
  it('Should hash boolean', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(true))
    Assert.IsEqual('bigint', typeof ValueHash.Hash(false))
    const A = ValueHash.Hash(true)
    const B = ValueHash.Hash(false)
    Assert.NotEqual(A, B)
  })
  it('Should hash null', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(null))
    const A = ValueHash.Hash(null)
    const B = ValueHash.Hash(undefined)
    Assert.NotEqual(A, B)
  })
  it('Should hash array', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash([0, 1, 2, 3]))
    const A = ValueHash.Hash([0, 1, 2, 3])
    const B = ValueHash.Hash([0, 2, 2, 3])
    Assert.NotEqual(A, B)
  })
  it('Should hash object 1', () => {
    // prettier-ignore
    Assert.IsEqual('bigint', typeof ValueHash.Hash({ x: 1, y: 2 }))
    const A = ValueHash.Hash({ x: 1, y: 2 })
    const B = ValueHash.Hash({ x: 2, y: 2 })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 2', () => {
    const A = ValueHash.Hash({ x: 1, y: [1, 2] })
    const B = ValueHash.Hash({ x: 1, y: [1, 3] })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 3', () => {
    const A = ValueHash.Hash({ x: 1, y: undefined })
    const B = ValueHash.Hash({ x: 1 })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 4', () => {
    const A = ValueHash.Hash({ x: 1, y: new Uint8Array([0, 1, 2]) })
    const B = ValueHash.Hash({ x: 1, y: [0, 1, 2] })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 5', () => {
    const A = ValueHash.Hash({ x: 1, y: undefined })
    const B = ValueHash.Hash({ x: 2, y: undefined })
    Assert.NotEqual(A, B)
  })
  it('Should hash Date', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(new Date()))
    const A = ValueHash.Hash(new Date(1))
    const B = ValueHash.Hash(new Date(2))
    Assert.NotEqual(A, B)
  })
  it('Should hash Uint8Array', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(new Uint8Array([0, 1, 2, 3])))
    const A = ValueHash.Hash(new Uint8Array([0, 1, 2, 3]))
    const B = ValueHash.Hash(new Uint8Array([0, 2, 2, 3]))
    Assert.NotEqual(A, B)
  })
  it('Should hash undefined', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(undefined))
    const A = ValueHash.Hash(undefined)
    const B = ValueHash.Hash(null)
    Assert.NotEqual(A, B)
  })
  it('Should hash symbol 1', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(Symbol()))
    const A = ValueHash.Hash(Symbol(1))
    const B = ValueHash.Hash(Symbol())
    Assert.NotEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(Symbol()))
    const A = ValueHash.Hash(Symbol(1))
    const B = ValueHash.Hash(Symbol(2))
    Assert.NotEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(Symbol()))
    const A = ValueHash.Hash(Symbol(1))
    const B = ValueHash.Hash(Symbol(1))
    Assert.IsEqual(A, B)
  })
  it('Should hash bigint 1', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(BigInt(1)))
    const A = ValueHash.Hash(BigInt(1))
    const B = ValueHash.Hash(BigInt(2))
    Assert.NotEqual(A, B)
  })
  it('Should hash bigint 2', () => {
    Assert.IsEqual('bigint', typeof ValueHash.Hash(BigInt(1)))
    const A = ValueHash.Hash(BigInt(1))
    const B = ValueHash.Hash(BigInt(1))
    Assert.IsEqual(A, B)
  })
  // ----------------------------------------------------------------
  // Unicode
  // ----------------------------------------------------------------
  it('Should hash unicode 1 (retain single byte hash)', () => {
    const hash = ValueHash.Hash('a')
    Assert.IsEqual(hash, 586962220959696054n)
  })
  it('Should hash unicode 2', () => {
    const hash = ValueHash.Hash('안녕 세계')
    Assert.IsEqual(hash, 11219208047802711777n)
  })
})
