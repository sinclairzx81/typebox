import { Assert } from '../../assert/index'
import * as ValueGuard from '@sinclair/typebox/value'

describe('value/guard/ValueGuard', () => {
  // -----------------------------------------------------
  // IsNull
  // -----------------------------------------------------
  it('Should guard Null 1', () => {
    const R = ValueGuard.IsNull(null)
    Assert.IsTrue(R)
  })
  it('Should guard Null 2', () => {
    const R = ValueGuard.IsNull({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsUndefined
  // -----------------------------------------------------
  it('Should guard Undefined 1', () => {
    const R = ValueGuard.IsUndefined(undefined)
    Assert.IsTrue(R)
  })
  it('Should guard Undefined 2', () => {
    const R = ValueGuard.IsUndefined({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsBigInt
  // -----------------------------------------------------
  it('Should guard BigInt 1', () => {
    const R = ValueGuard.IsBigInt(1n)
    Assert.IsTrue(R)
  })
  it('Should guard BigInt 2', () => {
    const R = ValueGuard.IsBigInt(1)
    Assert.IsFalse(R)
  })
  it('Should guard BigInt 3', () => {
    const R = ValueGuard.IsBigInt('123')
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsNumber
  // -----------------------------------------------------
  it('Should guard Number 1', () => {
    const R = ValueGuard.IsNumber(1)
    Assert.IsTrue(R)
  })
  it('Should guard Number 2', () => {
    const R = ValueGuard.IsNumber(3.14)
    Assert.IsTrue(R)
  })
  it('Should guard Number 3', () => {
    const R = ValueGuard.IsNumber('')
    Assert.IsFalse(R)
  })
  it('Should guard Number 4', () => {
    const R = ValueGuard.IsNumber(NaN)
    Assert.IsTrue(R)
  })
  // -----------------------------------------------------
  // IsString
  // -----------------------------------------------------
  it('Should guard String 1', () => {
    const R = ValueGuard.IsString('')
    Assert.IsTrue(R)
  })
  it('Should guard String 2', () => {
    const R = ValueGuard.IsString(true)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsBoolean
  // -----------------------------------------------------
  it('Should guard Boolean 1', () => {
    const R = ValueGuard.IsBoolean(true)
    Assert.IsTrue(R)
  })
  it('Should guard Boolean 2', () => {
    const R = ValueGuard.IsBoolean(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsObject
  // -----------------------------------------------------
  it('Should guard Object 1', () => {
    const R = ValueGuard.IsObject({})
    Assert.IsTrue(R)
  })
  it('Should guard Object 2', () => {
    const R = ValueGuard.IsObject(1)
    Assert.IsFalse(R)
  })
  it('Should guard Object 3', () => {
    const R = ValueGuard.IsObject([])
    Assert.IsTrue(R)
  })
  // -----------------------------------------------------
  // IsArray
  // -----------------------------------------------------
  it('Should guard Array 1', () => {
    const R = ValueGuard.IsArray([])
    Assert.IsTrue(R)
  })
  it('Should guard Array 2', () => {
    const R = ValueGuard.IsArray({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsAsyncIterator
  // -----------------------------------------------------
  it('Should guard AsyncIterator 1', () => {
    const R = ValueGuard.IsAsyncIterator((async function* (): any {})())
    Assert.IsTrue(R)
  })
  it('Should guard AsyncIterator 2', () => {
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
  it('Should guard Date 1', () => {
    const R = ValueGuard.IsDate(new Date())
    Assert.IsTrue(R)
  })
  it('Should guard Date 2', () => {
    const R = ValueGuard.IsDate({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsFunction
  // -----------------------------------------------------
  it('Should guard Function 1', () => {
    const R = ValueGuard.IsFunction(function () {})
    Assert.IsTrue(R)
  })
  it('Should guard Function 2', () => {
    const R = ValueGuard.IsFunction({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsInteger
  // -----------------------------------------------------
  it('Should guard Integer 1', () => {
    const R = ValueGuard.IsInteger(1)
    Assert.IsTrue(R)
  })
  it('Should guard Integer 2', () => {
    const R = ValueGuard.IsInteger(3.14)
    Assert.IsFalse(R)
  })
  it('Should guard Integer 3', () => {
    const R = ValueGuard.IsInteger(NaN)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsIterator
  // -----------------------------------------------------
  it('Should guard Iterator 1', () => {
    const R = ValueGuard.IsIterator((function* () {})())
    Assert.IsTrue(R)
  })
  it('Should guard Iterator 2', () => {
    const R = ValueGuard.IsIterator({})
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsStandardObject
  // -----------------------------------------------------
  it('Should guard StandardObject 1', () => {
    const R = ValueGuard.IsStandardObject({})
    Assert.IsTrue(R)
  })
  it('Should guard StandardObject 2', () => {
    const R = ValueGuard.IsStandardObject(1)
    Assert.IsFalse(R)
  })
  it('Should guard StandardObject 3', () => {
    const R = ValueGuard.IsStandardObject([])
    Assert.IsFalse(R)
  })
  it('Should guard StandardObject 4', () => {
    const R = ValueGuard.IsStandardObject(new (class {})())
    Assert.IsFalse(R)
  })
  it('Should guard StandardObject 5', () => {
    const R = ValueGuard.IsStandardObject(Object.create(null))
    Assert.IsTrue(R)
  })
  // -----------------------------------------------------
  // IsInstanceObject
  // -----------------------------------------------------
  it('Should guard InstanceObject 1', () => {
    const R = ValueGuard.IsInstanceObject({})
    Assert.IsFalse(R)
  })
  it('Should guard InstanceObject 2', () => {
    const R = ValueGuard.IsInstanceObject(1)
    Assert.IsFalse(R)
  })
  it('Should guard InstanceObject 3', () => {
    const R = ValueGuard.IsInstanceObject([])
    Assert.IsFalse(R)
  })
  it('Should guard InstanceObject 4', () => {
    const R = ValueGuard.IsInstanceObject(new (class {})())
    Assert.IsTrue(R)
  })
  // -----------------------------------------------------
  // IsPromise
  // -----------------------------------------------------
  it('Should guard Promise 1', () => {
    const R = ValueGuard.IsPromise(Promise.resolve(1))
    Assert.IsTrue(R)
  })
  it('Should guard Promise 2', () => {
    const R = ValueGuard.IsPromise(new (class {})())
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsSymbol
  // -----------------------------------------------------
  it('Should guard Symbol 1', () => {
    const R = ValueGuard.IsSymbol(Symbol(1))
    Assert.IsTrue(R)
  })
  it('Should guard Symbol 2', () => {
    const R = ValueGuard.IsSymbol(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsTypedArray
  // -----------------------------------------------------
  it('Should guard TypedArray 1', () => {
    const R = ValueGuard.IsTypedArray(new Uint8Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard TypedArray 2', () => {
    const R = ValueGuard.IsTypedArray(new Float32Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard TypedArray 3', () => {
    const R = ValueGuard.IsTypedArray(new ArrayBuffer(1))
    Assert.IsFalse(R)
  })
  it('Should guard TypedArray 4', () => {
    const R = ValueGuard.IsTypedArray(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsInt8Array
  // -----------------------------------------------------
  it('Should guard Int8Array 1', () => {
    const R = ValueGuard.IsInt8Array(new Int8Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Int8Array 2', () => {
    const R = ValueGuard.IsInt8Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Int8Array 2', () => {
    const R = ValueGuard.IsInt8Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsUint8Array
  // -----------------------------------------------------
  it('Should guard Uint8Array 1', () => {
    const R = ValueGuard.IsUint8Array(new Uint8Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Uint8Array 2', () => {
    const R = ValueGuard.IsUint8Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Uint8Array 2', () => {
    const R = ValueGuard.IsUint8Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsUint8ClampedArray
  // -----------------------------------------------------
  it('Should guard Uint8ClampedArray 1', () => {
    const R = ValueGuard.IsUint8ClampedArray(new Uint8ClampedArray(1))
    Assert.IsTrue(R)
  })
  it('Should guard Uint8ClampedArray 2', () => {
    const R = ValueGuard.IsUint8ClampedArray(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Uint8ClampedArray 2', () => {
    const R = ValueGuard.IsUint8ClampedArray(1)
    Assert.IsFalse(R)
  })

  // -----------------------------------------------------
  // IsInt16Array
  // -----------------------------------------------------
  it('Should guard Int16Array 1', () => {
    const R = ValueGuard.IsInt16Array(new Int16Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Int16Array 2', () => {
    const R = ValueGuard.IsInt16Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Int16Array 2', () => {
    const R = ValueGuard.IsInt16Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsUint16Array
  // -----------------------------------------------------
  it('Should guard Uint16Array 1', () => {
    const R = ValueGuard.IsUint16Array(new Uint16Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Uint16Array 2', () => {
    const R = ValueGuard.IsUint16Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Uint16Array 2', () => {
    const R = ValueGuard.IsUint16Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsInt32Array
  // -----------------------------------------------------
  it('Should guard Int32Array 1', () => {
    const R = ValueGuard.IsInt32Array(new Int32Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Int32Array 2', () => {
    const R = ValueGuard.IsInt32Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Int32Array 2', () => {
    const R = ValueGuard.IsInt32Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsUint32Array
  // -----------------------------------------------------
  it('Should guard Uint32Array 1', () => {
    const R = ValueGuard.IsUint32Array(new Uint32Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Uint32Array 2', () => {
    const R = ValueGuard.IsUint32Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Uint32Array 2', () => {
    const R = ValueGuard.IsUint32Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsFloat32Array
  // -----------------------------------------------------
  it('Should guard Float32Array 1', () => {
    const R = ValueGuard.IsFloat32Array(new Float32Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Float32Array 2', () => {
    const R = ValueGuard.IsFloat32Array(new Float64Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Float32Array 2', () => {
    const R = ValueGuard.IsFloat32Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsFloat64Array
  // -----------------------------------------------------
  it('Should guard Float64Array 1', () => {
    const R = ValueGuard.IsFloat64Array(new Float64Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard Float64Array 2', () => {
    const R = ValueGuard.IsFloat64Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Float64Array 2', () => {
    const R = ValueGuard.IsFloat64Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsBigInt64Array
  // -----------------------------------------------------
  it('Should guard BigInt64Array 1', () => {
    const R = ValueGuard.IsBigInt64Array(new BigInt64Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard BigInt64Array 2', () => {
    const R = ValueGuard.IsBigInt64Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard BigInt64Array 2', () => {
    const R = ValueGuard.IsBigInt64Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsBigUint64Array
  // -----------------------------------------------------
  it('Should guard BigUint64Array 1', () => {
    const R = ValueGuard.IsBigUint64Array(new BigUint64Array(1))
    Assert.IsTrue(R)
  })
  it('Should guard BigUint64Array 2', () => {
    const R = ValueGuard.IsBigUint64Array(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard BigUint64Array 2', () => {
    const R = ValueGuard.IsBigUint64Array(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsMap
  // -----------------------------------------------------
  it('Should guard Map 1', () => {
    const R = ValueGuard.IsMap(new Map())
    Assert.IsTrue(R)
  })
  it('Should guard Map 2', () => {
    const R = ValueGuard.IsMap(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Map 2', () => {
    const R = ValueGuard.IsMap(1)
    Assert.IsFalse(R)
  })
  // -----------------------------------------------------
  // IsSet
  // -----------------------------------------------------
  it('Should guard Set 1', () => {
    const R = ValueGuard.IsSet(new Set())
    Assert.IsTrue(R)
  })
  it('Should guard Set 2', () => {
    const R = ValueGuard.IsSet(new Float32Array(1))
    Assert.IsFalse(R)
  })
  it('Should guard Set 2', () => {
    const R = ValueGuard.IsSet(1)
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
