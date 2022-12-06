import { ValueHash } from '@sinclair/typebox/hash'
import { Assert } from '../assert/index'

describe('Hash', () => {
  it('Should hash number', () => {
    Assert.equal('bigint', typeof ValueHash.Hash(1))
    const A = ValueHash.Hash(1)
    const B = ValueHash.Hash(2)
    Assert.notEqual(A, B)
  })

  it('Should hash string', () => {
    Assert.equal('bigint', typeof ValueHash.Hash('hello'))
    const A = ValueHash.Hash('hello')
    const B = ValueHash.Hash('world')
    Assert.notEqual(A, B)
  })

  it('Should hash boolean', () => {
    Assert.equal('bigint', typeof ValueHash.Hash(true))
    Assert.equal('bigint', typeof ValueHash.Hash(false))
    const A = ValueHash.Hash(true)
    const B = ValueHash.Hash(false)
    Assert.notEqual(A, B)
  })

  it('Should not hash bigint', () => {
    Assert.throws(() => ValueHash.Hash(1n))
  })

  it('Should hash null', () => {
    Assert.equal('bigint', typeof ValueHash.Hash(null))
    const A = ValueHash.Hash(null)
    const B = ValueHash.Hash(undefined)
    Assert.notEqual(A, B)
  })

  it('Should hash array', () => {
    Assert.equal('bigint', typeof ValueHash.Hash([0, 1, 2, 3]))
    const A = ValueHash.Hash([0, 1, 2, 3])
    const B = ValueHash.Hash([0, 2, 2, 3])
    Assert.notEqual(A, B)
  })

  it('Should hash object 1', () => {
    // prettier-ignore
    Assert.equal('bigint', typeof ValueHash.Hash({ x: 1, y: 2 }))
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
    Assert.equal('bigint', typeof ValueHash.Hash(new Date()))
    const A = ValueHash.Hash(new Date(1))
    const B = ValueHash.Hash(new Date(2))
    Assert.notEqual(A, B)
  })

  it('Should hash Uint8Array', () => {
    Assert.equal('bigint', typeof ValueHash.Hash(new Uint8Array([0, 1, 2, 3])))
    const A = ValueHash.Hash(new Uint8Array([0, 1, 2, 3]))
    const B = ValueHash.Hash(new Uint8Array([0, 2, 2, 3]))
    Assert.notEqual(A, B)
  })

  it('Should hash undefined', () => {
    Assert.equal('bigint', typeof ValueHash.Hash(undefined))
    const A = ValueHash.Hash(undefined)
    const B = ValueHash.Hash(null)
    Assert.notEqual(A, B)
  })
})
