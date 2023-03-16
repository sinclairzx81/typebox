import { ValueHash } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/hash/Hash', () => {
  it('Should hash number', () => {
    Assert.equal('bigint', typeof ValueHash.Create(1))
    const A = ValueHash.Create(1)
    const B = ValueHash.Create(2)
    Assert.notEqual(A, B)
  })
  it('Should hash string', () => {
    Assert.equal('bigint', typeof ValueHash.Create('hello'))
    const A = ValueHash.Create('hello')
    const B = ValueHash.Create('world')
    Assert.notEqual(A, B)
  })
  it('Should hash boolean', () => {
    Assert.equal('bigint', typeof ValueHash.Create(true))
    Assert.equal('bigint', typeof ValueHash.Create(false))
    const A = ValueHash.Create(true)
    const B = ValueHash.Create(false)
    Assert.notEqual(A, B)
  })
  it('Should hash null', () => {
    Assert.equal('bigint', typeof ValueHash.Create(null))
    const A = ValueHash.Create(null)
    const B = ValueHash.Create(undefined)
    Assert.notEqual(A, B)
  })
  it('Should hash array', () => {
    Assert.equal('bigint', typeof ValueHash.Create([0, 1, 2, 3]))
    const A = ValueHash.Create([0, 1, 2, 3])
    const B = ValueHash.Create([0, 2, 2, 3])
    Assert.notEqual(A, B)
  })
  it('Should hash object 1', () => {
    // prettier-ignore
    Assert.equal('bigint', typeof ValueHash.Create({ x: 1, y: 2 }))
    const A = ValueHash.Create({ x: 1, y: 2 })
    const B = ValueHash.Create({ x: 2, y: 2 })
    Assert.notEqual(A, B)
  })
  it('Should hash object 2', () => {
    const A = ValueHash.Create({ x: 1, y: [1, 2] })
    const B = ValueHash.Create({ x: 1, y: [1, 3] })
    Assert.notEqual(A, B)
  })
  it('Should hash object 3', () => {
    const A = ValueHash.Create({ x: 1, y: undefined })
    const B = ValueHash.Create({ x: 1 })
    Assert.notEqual(A, B)
  })
  it('Should hash object 4', () => {
    const A = ValueHash.Create({ x: 1, y: new Uint8Array([0, 1, 2]) })
    const B = ValueHash.Create({ x: 1, y: [0, 1, 2] })
    Assert.notEqual(A, B)
  })
  it('Should hash object 5', () => {
    const A = ValueHash.Create({ x: 1, y: undefined })
    const B = ValueHash.Create({ x: 2, y: undefined })
    Assert.notEqual(A, B)
  })
  it('Should hash Date', () => {
    Assert.equal('bigint', typeof ValueHash.Create(new Date()))
    const A = ValueHash.Create(new Date(1))
    const B = ValueHash.Create(new Date(2))
    Assert.notEqual(A, B)
  })
  it('Should hash Uint8Array', () => {
    Assert.equal('bigint', typeof ValueHash.Create(new Uint8Array([0, 1, 2, 3])))
    const A = ValueHash.Create(new Uint8Array([0, 1, 2, 3]))
    const B = ValueHash.Create(new Uint8Array([0, 2, 2, 3]))
    Assert.notEqual(A, B)
  })
  it('Should hash undefined', () => {
    Assert.equal('bigint', typeof ValueHash.Create(undefined))
    const A = ValueHash.Create(undefined)
    const B = ValueHash.Create(null)
    Assert.notEqual(A, B)
  })
  it('Should hash symbol 1', () => {
    Assert.equal('bigint', typeof ValueHash.Create(Symbol()))
    const A = ValueHash.Create(Symbol(1))
    const B = ValueHash.Create(Symbol())
    Assert.notEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.equal('bigint', typeof ValueHash.Create(Symbol()))
    const A = ValueHash.Create(Symbol(1))
    const B = ValueHash.Create(Symbol(2))
    Assert.notEqual(A, B)
  })
  it('Should hash symbol 2', () => {
    Assert.equal('bigint', typeof ValueHash.Create(Symbol()))
    const A = ValueHash.Create(Symbol(1))
    const B = ValueHash.Create(Symbol(1))
    Assert.equal(A, B)
  })
  it('Should hash bigint 1', () => {
    Assert.equal('bigint', typeof ValueHash.Create(BigInt(1)))
    const A = ValueHash.Create(BigInt(1))
    const B = ValueHash.Create(BigInt(2))
    Assert.notEqual(A, B)
  })
  it('Should hash bigint 2', () => {
    Assert.equal('bigint', typeof ValueHash.Create(BigInt(1)))
    const A = ValueHash.Create(BigInt(1))
    const B = ValueHash.Create(BigInt(1))
    Assert.equal(A, B)
  })
})
