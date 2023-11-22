import { Assert } from '../../assert/index'
import * as ValueGuard from '@sinclair/typebox/value'

describe('value/guard/ValueGuard', () => {
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
  // Specialized (Values Only)
  // -----------------------------------------------------
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
  // HasPropertyKey
  // -----------------------------------------------------
  it('Should guard property key 1', () => {
    const O = { x: 10 }
    const R = ValueGuard.HasPropertyKey(O, 'x')
    Assert.IsTrue(R)
  })
  it('Should guard property key 2', () => {
    const O = { x: 10 }
    const R = ValueGuard.HasPropertyKey(O, 'y')
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsDate
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
  // IsInteger
  // -----------------------------------------------------
  it('Should guard integer 1', () => {
    const R = ValueGuard.IsInteger(1)
    Assert.IsTrue(R)
  })
  it('Should guard integer 2', () => {
    const R = ValueGuard.IsInteger(3.14)
    Assert.IsFalse(R)
  })
  it('Should guard integer 3', () => {
    const R = ValueGuard.IsInteger(NaN)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsIterator
  // -----------------------------------------------------
  it('Should guard iterator 1', () => {
    const R = ValueGuard.IsIterator((function* () {})())
    Assert.IsTrue(R)
  })
  it('Should guard iterator 2', () => {
    const R = ValueGuard.IsIterator({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsPlainObject
  // -----------------------------------------------------
  it('Should guard plain object 1', () => {
    const R = ValueGuard.IsPlainObject({})
    Assert.IsTrue(R)
  })
  it('Should guard plain object 2', () => {
    const R = ValueGuard.IsPlainObject(new (class {})())
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsPromise
  // -----------------------------------------------------
  it('Should guard promise 1', () => {
    const R = ValueGuard.IsPromise(Promise.resolve(1))
    Assert.IsTrue(R)
  })
  it('Should guard promise 2', () => {
    const R = ValueGuard.IsPromise(new (class {})())
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsSymbol
  // -----------------------------------------------------
  it('Should guard symbol 1', () => {
    const R = ValueGuard.IsSymbol(Symbol(1))
    Assert.IsTrue(R)
  })
  it('Should guard symbol 2', () => {
    const R = ValueGuard.IsSymbol(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsTypedArray
  // -----------------------------------------------------
  it('Should guard typed array 1', () => {
    const R = ValueGuard.IsTypedArray(new Uint8Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard typed array 2', () => {
    const R = ValueGuard.IsTypedArray(new Float32Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard typed array 3', () => {
    const R = ValueGuard.IsTypedArray(new ArrayBuffer(1))
    Assert.IsFalse(R)
  })
  it('Should guard typed array 4', () => {
    const R = ValueGuard.IsTypedArray(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsUint8Array
  // -----------------------------------------------------
  it('Should guard uint8array 1', () => {
    const R = ValueGuard.IsUint8Array(new Uint8Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard uint8array 2', () => {
    const R = ValueGuard.IsUint8Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard uint8array 2', () => {
    const R = ValueGuard.IsUint8Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsValueType
  // -----------------------------------------------------
  it('Should guard value type 1', () => {
    const R = ValueGuard.IsValueType(1)
    Assert.IsTrue(R)
  })
  it('Should guard value type 2', () => {
    const R = ValueGuard.IsValueType(true)
    Assert.IsTrue(R)
  })
  it('Should guard value type 3', () => {
    const R = ValueGuard.IsValueType(false)
    Assert.IsTrue(R)
  })
  it('Should guard value type 4', () => {
    const R = ValueGuard.IsValueType('hello')
    Assert.IsTrue(R)
  })
  it('Should guard value type 5', () => {
    const R = ValueGuard.IsValueType(1n)
    Assert.IsTrue(R)
  })
  it('Should guard value type 6', () => {
    const R = ValueGuard.IsValueType(null)
    Assert.IsTrue(R)
  })
  it('Should guard value type 7', () => {
    const R = ValueGuard.IsValueType(undefined)
    Assert.IsTrue(R)
  })
  it('Should guard value type 8', () => {
    const R = ValueGuard.IsValueType(function () {})
    Assert.IsFalse(R)
  })
  it('Should guard value type 9', () => {
    const R = ValueGuard.IsValueType({})
    Assert.IsFalse(R)
  })
  it('Should guard value type 10', () => {
    const R = ValueGuard.IsValueType([])
    Assert.IsFalse(R)
  })
  it('Should guard value type 11', () => {
    const R = ValueGuard.IsValueType(class {})
    Assert.IsFalse(R)
  })
  it('Should guard value type 12', () => {
    const R = ValueGuard.IsValueType(new (class {})())
    Assert.IsFalse(R)
  })
})
