import { Assert } from '../../../assert/index'
import { ValueGuard } from '@sinclair/typebox'

describe('type/ValueGuard', () => {
  // -----------------------------------------------------
  // IsSymbol
  // -----------------------------------------------------
  it('Should guard symbol 1', () => {
    const R = ValueGuard.IsSymbol(Symbol())
    Assert.IsTrue(R)
  })
  it('Should guard symbol 2', () => {
    const R = ValueGuard.IsSymbol({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsNull
  // -----------------------------------------------------
  it('Should guard null 1', () => {
    const R = ValueGuard.IsNull(null)
    Assert.IsTrue(R)
  })
  it('Should guard null 2', () => {
    const R = ValueGuard.IsNull({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsUndefined
  // -----------------------------------------------------
  it('Should guard undefined 1', () => {
    const R = ValueGuard.IsUndefined(undefined)
    Assert.IsTrue(R)
  })
  it('Should guard undefined 2', () => {
    const R = ValueGuard.IsUndefined({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsBigInt
  // -----------------------------------------------------
  it('Should guard bigint 1', () => {
    const R = ValueGuard.IsBigInt(1n)
    Assert.IsTrue(R)
  })
  it('Should guard bigint 2', () => {
    const R = ValueGuard.IsBigInt(1)
    Assert.IsFalse(R)
  })
  it('Should guard bigint 3', () => {
    const R = ValueGuard.IsBigInt('123')
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsNumber
  // -----------------------------------------------------
  it('Should guard number 1', () => {
    const R = ValueGuard.IsNumber(1)
    Assert.IsTrue(R)
  })
  it('Should guard number 2', () => {
    const R = ValueGuard.IsNumber(3.14)
    Assert.IsTrue(R)
  })
  it('Should guard number 3', () => {
    const R = ValueGuard.IsNumber('')
    Assert.IsFalse(R)
  })
  it('Should guard number 4', () => {
    const R = ValueGuard.IsNumber(NaN)
    Assert.IsTrue(R)
  })
  // -----------------------------------------------------
  // IsString
  // -----------------------------------------------------
  it('Should guard string 1', () => {
    const R = ValueGuard.IsString('')
    Assert.IsTrue(R)
  })
  it('Should guard string 2', () => {
    const R = ValueGuard.IsString(true)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsBoolean
  // -----------------------------------------------------
  it('Should guard boolean 1', () => {
    const R = ValueGuard.IsBoolean(true)
    Assert.IsTrue(R)
  })
  it('Should guard boolean 2', () => {
    const R = ValueGuard.IsBoolean(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsObject
  // -----------------------------------------------------
  it('Should guard object 1', () => {
    const R = ValueGuard.IsObject({})
    Assert.IsTrue(R)
  })
  it('Should guard object 2', () => {
    const R = ValueGuard.IsObject(1)
    Assert.IsFalse(R)
  })
  it('Should guard object 3', () => {
    const R = ValueGuard.IsObject([])
    Assert.IsTrue(R)
  })
  // -----------------------------------------------------
  // IsArray
  // -----------------------------------------------------
  it('Should guard array 1', () => {
    const R = ValueGuard.IsArray([])
    Assert.IsTrue(R)
  })
  it('Should guard array 2', () => {
    const R = ValueGuard.IsArray({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsFunction
  // -----------------------------------------------------
  it('Should guard function 1', () => {
    const R = ValueGuard.IsFunction(function () {})
    Assert.IsTrue(R)
  })
  it('Should guard function 2', () => {
    const R = ValueGuard.IsFunction({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsAsyncIterator
  // -----------------------------------------------------
  it('Should guard async iterator 1', () => {
    const R = ValueGuard.IsAsyncIterator((async function* (): any {})())
    Assert.IsTrue(R)
  })
  it('Should guard async iterator 2', () => {
    const R = ValueGuard.IsAsyncIterator((function* (): any {})())
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsAsyncIterator
  // -----------------------------------------------------
  it('Should guard iterator 1', () => {
    const R = ValueGuard.IsIterator((function* (): any {})())
    Assert.IsTrue(R)
  })
  it('Should guard iterator 2', () => {
    const R = ValueGuard.IsIterator((async function* (): any {})())
    Assert.IsFalse(R)
  })
  it('Should guard iterator 3', () => {
    const R = ValueGuard.IsIterator([])
    Assert.IsFalse(R)
  })
  it('Should guard iterator 4', () => {
    const R = ValueGuard.IsIterator(new Uint8Array())
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // Date
  // -----------------------------------------------------
  it('Should guard date 1', () => {
    const R = ValueGuard.IsDate(new Date())
    Assert.IsTrue(R)
  })
  it('Should guard date 2', () => {
    const R = ValueGuard.IsDate({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // Date
  // -----------------------------------------------------
  it('Should guard uint8array 1', () => {
    const R = ValueGuard.IsUint8Array(new Uint8Array())
    Assert.IsTrue(R)
  })
  it('Should guard uint8array 2', () => {
    const R = ValueGuard.IsUint8Array({})
    Assert.IsFalse(R)
  })
  it('Should guard uint8array 2', () => {
    const R = ValueGuard.IsUint8Array([])
    Assert.IsFalse(R)
  })
})
