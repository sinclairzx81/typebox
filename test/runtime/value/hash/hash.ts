import { Hash } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/hash/Hash', () => {
  it('Should hash number', () => {
    Assert.IsEqual('bigint', typeof Hash(1))
    const A = Hash(1)
    const B = Hash(2)
    Assert.NotEqual(A, B)
  })
  it('Should hash string', () => {
    Assert.IsEqual('bigint', typeof Hash('hello'))
    const A = Hash('hello')
    const B = Hash('world')
    Assert.NotEqual(A, B)
  })
  it('Should hash boolean', () => {
    Assert.IsEqual('bigint', typeof Hash(true))
    Assert.IsEqual('bigint', typeof Hash(false))
    const A = Hash(true)
    const B = Hash(false)
    Assert.NotEqual(A, B)
  })
  it('Should hash null', () => {
    Assert.IsEqual('bigint', typeof Hash(null))
    const A = Hash(null)
    const B = Hash(undefined)
    Assert.NotEqual(A, B)
  })
  it('Should hash array', () => {
    Assert.IsEqual('bigint', typeof Hash([0, 1, 2, 3]))
    const A = Hash([0, 1, 2, 3])
    const B = Hash([0, 2, 2, 3])
    Assert.NotEqual(A, B)
  })
  it('Should hash object 1', () => {
    // prettier-ignore
    Assert.IsEqual('bigint', typeof Hash({ x: 1, y: 2 }))
    const A = Hash({ x: 1, y: 2 })
    const B = Hash({ x: 2, y: 2 })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 2', () => {
    const A = Hash({ x: 1, y: [1, 2] })
    const B = Hash({ x: 1, y: [1, 3] })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 3', () => {
    const A = Hash({ x: 1, y: undefined })
    const B = Hash({ x: 1 })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 4', () => {
    const A = Hash({ x: 1, y: new Uint8Array([0, 1, 2]) })
    const B = Hash({ x: 1, y: [0, 1, 2] })
    Assert.NotEqual(A, B)
  })
  it('Should hash object 5', () => {
    const A = Hash({ x: 1, y: undefined })
    const B = Hash({ x: 2, y: undefined })
    Assert.NotEqual(A, B)
  })
  it('Should hash Date', () => {
    Assert.IsEqual('bigint', typeof Hash(new Date()))
    const A = Hash(new Date(1))
    const B = Hash(new Date(2))
    Assert.NotEqual(A, B)
  })
  it('Should hash Uint8Array', () => {
    Assert.IsEqual('bigint', typeof Hash(new Uint8Array([0, 1, 2, 3])))
    const A = Hash(new Uint8Array([0, 1, 2, 3]))
    const B = Hash(new Uint8Array([0, 2, 2, 3]))
    Assert.NotEqual(A, B)
  })
  it('Should hash undefined', () => {
    Assert.IsEqual('bigint', typeof Hash(undefined))
    const A = Hash(undefined)
    const B = Hash(null)
    Assert.NotEqual(A, B)
  })
  it('Should hash symbol 1', () => {
    Assert.IsEqual('bigint', typeof Hash(Symbol()))
    const A = Hash(Symbol(1))
    const B = Hash(Symbol())
    Assert.NotEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.IsEqual('bigint', typeof Hash(Symbol()))
    const A = Hash(Symbol(1))
    const B = Hash(Symbol(2))
    Assert.NotEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.IsEqual('bigint', typeof Hash(Symbol()))
    const A = Hash(Symbol(1))
    const B = Hash(Symbol(1))
    Assert.IsEqual(A, B)
  })
  it('Should hash bigint 1', () => {
    Assert.IsEqual('bigint', typeof Hash(BigInt(1)))
    const A = Hash(BigInt(1))
    const B = Hash(BigInt(2))
    Assert.NotEqual(A, B)
  })
  it('Should hash bigint 2', () => {
    Assert.IsEqual('bigint', typeof Hash(BigInt(1)))
    const A = Hash(BigInt(1))
    const B = Hash(BigInt(1))
    Assert.IsEqual(A, B)
  })
  // ----------------------------------------------------------------
  // Unicode
  // ----------------------------------------------------------------
  it('Should hash unicode 1 (retain single byte hash)', () => {
    const hash = Hash('a')
    Assert.IsEqual(hash, 586962220959696054n)
  })
  it('Should hash unicode 2', () => {
    const hash = Hash('안녕 세계')
    Assert.IsEqual(hash, 11219208047802711777n)
  })
})
