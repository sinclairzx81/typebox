import { Assert } from '../../assert/index'
import { ValueGuard } from '@sinclair/typebox'

describe('type/ValueGuard', () => {
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
})
