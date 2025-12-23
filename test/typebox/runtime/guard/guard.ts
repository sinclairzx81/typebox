import { Assert } from 'test'
import Guard from 'typebox/guard'

const Test = Assert.Context('Guard')

// ------------------------------------------------------------------
// Guard.IsEqual
// ------------------------------------------------------------------
Test('Should guard IsEqual: 1', () => {
  const result = Guard.IsEqual(1, 1)
  Assert.IsEqual(result, true)
})
Test('Should guard IsEqual: 2', () => {
  const result = Guard.IsEqual(1, 2)
  Assert.IsEqual(result, false)
})
Test('Should guard IsEqual: NaN', () => {
  Assert.IsEqual(Guard.IsEqual(NaN, NaN), false)
})
Test('Should guard IsEqual: 0/-0', () => {
  Assert.IsEqual(Guard.IsEqual(0, -0), true)
})
Test('Should guard IsEqual: objects', () => {
  const obj = {}
  Assert.IsEqual(Guard.IsEqual(obj, obj), true)
  Assert.IsEqual(Guard.IsEqual({}, {}), false)
})
Test('Should guard IsEqual: primitives', () => {
  Assert.IsEqual(Guard.IsEqual('a', 'a'), true)
  Assert.IsEqual(Guard.IsEqual(true, true), true)
  Assert.IsEqual(Guard.IsEqual(null, null), true)
  Assert.IsEqual(Guard.IsEqual(undefined, undefined), true)
})
// ------------------------------------------------------------------
// Guard.IsGreaterThan
// ------------------------------------------------------------------
Test('Should guard IsGreaterThan: 1', () => {
  Assert.IsEqual(Guard.IsGreaterThan(2, 1), true)
})
Test('Should guard IsGreaterThan: 2', () => {
  Assert.IsEqual(Guard.IsGreaterThan(1, 2), false)
})
Test('Should guard IsGreaterThan: equal', () => {
  Assert.IsEqual(Guard.IsGreaterThan(2, 2), false)
})
Test('Should guard IsGreaterThan: NaN', () => {
  Assert.IsEqual(Guard.IsGreaterThan(NaN, 1), false)
  Assert.IsEqual(Guard.IsGreaterThan(1, NaN), false)
})
// ------------------------------------------------------------------
// Guard.IsLessThan
// ------------------------------------------------------------------
Test('Should guard IsLessThan: 1', () => {
  Assert.IsEqual(Guard.IsLessThan(1, 2), true)
})
Test('Should guard IsLessThan: 2', () => {
  Assert.IsEqual(Guard.IsLessThan(2, 1), false)
})
Test('Should guard IsLessThan: equal', () => {
  Assert.IsEqual(Guard.IsLessThan(2, 2), false)
})
Test('Should guard IsLessThan: NaN', () => {
  Assert.IsEqual(Guard.IsLessThan(NaN, 1), false)
  Assert.IsEqual(Guard.IsLessThan(1, NaN), false)
})
// ------------------------------------------------------------------
// Guard.IsLessEqualThan
// ------------------------------------------------------------------
Test('Should guard IsLessEqualThan: 1', () => {
  Assert.IsEqual(Guard.IsLessEqualThan(1, 2), true)
})
Test('Should guard IsLessEqualThan: 2', () => {
  Assert.IsEqual(Guard.IsLessEqualThan(2, 1), false)
})
Test('Should guard IsLessEqualThan: equal', () => {
  Assert.IsEqual(Guard.IsLessEqualThan(2, 2), true)
})
// ------------------------------------------------------------------
// Guard.IsGreaterEqualThan
// ------------------------------------------------------------------
Test('Should guard IsGreaterEqualThan: 1', () => {
  Assert.IsEqual(Guard.IsGreaterEqualThan(2, 1), true)
})
Test('Should guard IsGreaterEqualThan: 2', () => {
  Assert.IsEqual(Guard.IsGreaterEqualThan(1, 2), false)
})
Test('Should guard IsGreaterEqualThan: equal', () => {
  Assert.IsEqual(Guard.IsGreaterEqualThan(2, 2), true)
})
// ------------------------------------------------------------------
// Guard.IsMultipleOf
// ------------------------------------------------------------------
Test('Should guard IsMultipleOf: 1', () => {
  Assert.IsEqual(Guard.IsMultipleOf(6, 3), true)
})
Test('Should guard IsMultipleOf: 2', () => {
  Assert.IsEqual(Guard.IsMultipleOf(7, 3), false)
})
Test('Should guard IsMultipleOf: float', () => {
  Assert.IsEqual(Guard.IsMultipleOf(4.5, 1.5), true)
})
Test('Should guard IsMultipleOf: non-number', () => {
  Assert.IsEqual(Guard.IsMultipleOf('not-a-number' as never, 3), true)
})
Test('Should guard IsMultipleOf: tolerance', () => {
  Assert.IsEqual(Guard.IsMultipleOf(0.1 + 0.2, 0.3), true)
})
Test('Should guard IsMultipleOf: 1', () => {
  Assert.IsEqual(Guard.IsMultipleOf(BigInt(6), 3), true)
})
Test('Should guard IsMultipleOf: 2', () => {
  Assert.IsEqual(Guard.IsMultipleOf(BigInt(7), 3), false)
})
Test('Should guard IsMultipleOf: 3', () => {
  Assert.IsEqual(Guard.IsMultipleOf(BigInt(6), BigInt(3)), true)
})
Test('Should guard IsMultipleOf: 4', () => {
  Assert.IsEqual(Guard.IsMultipleOf(BigInt(7), BigInt(3)), false)
})
Test('Should guard IsMultipleOf: 5', () => {
  Assert.IsEqual(Guard.IsMultipleOf(6, BigInt(3)), true)
})
Test('Should guard IsMultipleOf: 2', () => {
  Assert.IsEqual(Guard.IsMultipleOf(7, BigInt(3)), false)
})
// ------------------------------------------------------------------
// Guard.IsHasPropertyKey
// ------------------------------------------------------------------
Test('Should guard HasPropertyKey: 1', () => {
  Assert.IsEqual(Guard.HasPropertyKey({ a: 1 }, 'a'), true)
})
Test('Should guard HasPropertyKey: 2', () => {
  Assert.IsEqual(Guard.HasPropertyKey({ a: 1 }, 'b'), false)
})
Test('Should guard HasPropertyKey: prototype', () => {
  const obj = Object.create({ a: 1 })
  Assert.IsEqual(Guard.HasPropertyKey(obj, 'a'), true)
})
// ------------------------------------------------------------------
// Guard.IsArray
// ------------------------------------------------------------------
Test('Should guard IsArray: 1', () => {
  Assert.IsEqual(Guard.IsArray([]), true)
})
Test('Should guard IsArray: 2', () => {
  Assert.IsEqual(Guard.IsArray({}), false)
})
// ------------------------------------------------------------------
// Guard.IsBigInt
// ------------------------------------------------------------------
Test('Should guard IsBigInt: 1', () => {
  Assert.IsEqual(Guard.IsBigInt(1n), true)
})
Test('Should guard IsBigInt: 2', () => {
  Assert.IsEqual(Guard.IsBigInt(1), false)
})
// ------------------------------------------------------------------
// Guard.IsBoolean
// ------------------------------------------------------------------
Test('Should guard IsBoolean: 1', () => {
  Assert.IsEqual(Guard.IsBoolean(true), true)
})
Test('Should guard IsBoolean: 2', () => {
  Assert.IsEqual(Guard.IsBoolean(new Boolean(true)), false)
})
// ------------------------------------------------------------------
// Guard.IsInteger
// ------------------------------------------------------------------
Test('Should guard IsInteger: 1', () => {
  Assert.IsEqual(Guard.IsInteger(5), true)
})
Test('Should guard IsInteger: 2', () => {
  Assert.IsEqual(Guard.IsInteger(5.1), false)
})
// ------------------------------------------------------------------
// Guard.IsNull
// ------------------------------------------------------------------
Test('Should guard IsNull: 1', () => {
  Assert.IsEqual(Guard.IsNull(null), true)
})
Test('Should guard IsNull: 2', () => {
  Assert.IsEqual(Guard.IsNull(undefined), false)
})
// ------------------------------------------------------------------
// Guard.IsNumber
// ------------------------------------------------------------------
Test('Should guard IsNumber: 1', () => {
  Assert.IsEqual(Guard.IsNumber(123), true)
})
Test('Should guard IsNumber: 2', () => {
  Assert.IsEqual(Guard.IsNumber('123'), false)
})
Test('Should guard IsNumber: NaN', () => {
  Assert.IsEqual(Guard.IsNumber(NaN), false)
})
// ------------------------------------------------------------------
// Guard.IsObject
// ------------------------------------------------------------------
Test('Should guard IsObject: 1', () => {
  Assert.IsEqual(Guard.IsObject({}), true)
})
Test('Should guard IsObject: 2', () => {
  Assert.IsEqual(Guard.IsObject(null), false)
})
// ------------------------------------------------------------------
// Guard.IsString
// ------------------------------------------------------------------
Test('Should guard IsString: 1', () => {
  Assert.IsEqual(Guard.IsString('test'), true)
})
Test('Should guard IsString: 2', () => {
  Assert.IsEqual(Guard.IsString(new String('test')), false)
})
// ------------------------------------------------------------------
// Guard.IsSymbol
// ------------------------------------------------------------------
Test('Should guard IsSymbol: 1', () => {
  Assert.IsEqual(Guard.IsSymbol(Symbol()), true)
})
Test('Should guard IsSymbol: 2', () => {
  Assert.IsEqual(Guard.IsSymbol('symbol'), false)
})
// ------------------------------------------------------------------
// Guard.IsUndefined
// ------------------------------------------------------------------
Test('Should guard IsUndefined: 1', () => {
  Assert.IsEqual(Guard.IsUndefined(undefined), true)
})
Test('Should guard IsUndefined: 2', () => {
  Assert.IsEqual(Guard.IsUndefined(null), false)
})
// ------------------------------------------------------------------
// Guard.IsFunction
// ------------------------------------------------------------------
Test('Should guard IsFunction: 1', () => {
  Assert.IsEqual(Guard.IsFunction(() => {}), true)
})
Test('Should guard IsFunction: 2', () => {
  Assert.IsEqual(Guard.IsFunction({}), false)
})
// ------------------------------------------------------------------
// Guard.IsConstructor
// ------------------------------------------------------------------
Test('Should guard IsConstructor: 1', () => {
  class Test {}
  Assert.IsEqual(Guard.IsConstructor(Test), true)
})
Test('Should guard IsConstructor: 2', () => {
  Assert.IsEqual(Guard.IsConstructor(Date), true)
})
Test('Should guard IsConstructor: 3', () => {
  Assert.IsEqual(Guard.IsConstructor(Uint8Array), true)
})
Test('Should guard IsConstructor: 4', () => {
  Assert.IsEqual(Guard.IsConstructor(() => {}), false)
})
// ------------------------------------------------------------------
// DeepObject
// ------------------------------------------------------------------
Test('Should guard DeepObject: 1', () => {
  Assert.IsEqual(Guard.IsDeepEqual({}, 1), false)
})
Test('Should guard DeepObject: 2', () => {
  Assert.IsEqual(Guard.IsDeepEqual(1, {}), false)
})
// ------------------------------------------------------------------
// Guard.IsClassInstance
// ------------------------------------------------------------------
Test('Should IsClassInstance 1', () => {
  class Person {}
  const john = new Person()
  Assert.IsEqual(Guard.IsClassInstance(john), true)
})
Test('Should IsClassInstance 2', () => {
  function Vehicle() {}
  // @ts-ignore
  const car = new Vehicle()
  Assert.IsEqual(Guard.IsClassInstance(car), true)
})
Test('Should IsClassInstance 3', () => {
  const d = new Date()
  Assert.IsEqual(Guard.IsClassInstance(d), true)
})
Test('Should IsClassInstance 4', () => {
  const arr: unknown[] = []
  Assert.IsEqual(Guard.IsClassInstance(arr), true)
})
Test('Should IsClassInstance 5', () => {
  const map = new Map()
  Assert.IsEqual(Guard.IsClassInstance(map), true)
})
Test('Should IsClassInstance 6', () => {
  const set = new Set()
  Assert.IsEqual(Guard.IsClassInstance(set), true)
})
Test('Should IsClassInstance 7', () => {
  Assert.IsEqual(Guard.IsClassInstance({}), false)
})
Test('Should IsClassInstance 8', () => {
  const obj = Object.create(null)
  Assert.IsEqual(Guard.IsClassInstance(obj), false)
})
Test('Should IsClassInstance 9', () => {
  Assert.IsEqual(Guard.IsClassInstance(42), false)
})
Test('Should IsClassInstance 10', () => {
  Assert.IsEqual(Guard.IsClassInstance('test'), false)
})
Test('Should IsClassInstance 11', () => {
  Assert.IsEqual(Guard.IsClassInstance(null), false)
})
Test('Should IsClassInstance 12', () => {
  Assert.IsEqual(Guard.IsClassInstance(undefined), false)
})
Test('Should IsClassInstance 13', () => {
  const boolObj = new Boolean(true)
  Assert.IsEqual(Guard.IsClassInstance(boolObj), true)
})
Test('Should IsClassInstance 14', () => {
  const numObj = new Number(123)
  Assert.IsEqual(Guard.IsClassInstance(numObj), true)
})
Test('Should IsClassInstance 15', () => {
  const strObj = new String('abc')
  Assert.IsEqual(Guard.IsClassInstance(strObj), true)
})
// ------------------------------------------------------------------
// Guard.StringGraphemeCount
// ------------------------------------------------------------------
Test('Should StringGraphemeCount 1', () => {
  Assert.IsEqual(Guard.StringGraphemeCount(''), 0)
})
Test('Should StringGraphemeCount 2', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a'), 1)
})
Test('Should StringGraphemeCount 3', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('hello'), 5)
})
Test('Should StringGraphemeCount 4', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a b c'), 5)
})
Test('Should StringGraphemeCount 5', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('!?.'), 3)
})
Test('Should StringGraphemeCount 6', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('é'), 1)
})
Test('Should StringGraphemeCount 7', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('éàè'), 3)
})
Test('Should StringGraphemeCount 8', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('e\u0301'), 1)
})
Test('Should StringGraphemeCount 9', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a\u0301b\u0301'), 2)
})
Test('Should StringGraphemeCount 10', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('漢字'), 2)
})
Test('Should StringGraphemeCount 11', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('😄'), 1)
})
Test('Should StringGraphemeCount 12', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('😄😄😄'), 3)
})
Test('Should StringGraphemeCount 13', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('😄🎉🔥'), 3)
})
Test('Should StringGraphemeCount 14', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('Hello 😄!'), 8)
})
Test('Should StringGraphemeCount 15', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('𝄞'), 1)
})
Test('Should StringGraphemeCount 16', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('𝄞𝄞'), 2)
})
Test('Should StringGraphemeCount 17', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('A𝄞B'), 3)
})
Test('Should StringGraphemeCount 18', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a😄b'), 3)
})
Test('Should StringGraphemeCount 19', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('😄🎉'), 2)
})
Test('Should StringGraphemeCount 20', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🗺️'), 1)
})
Test('Should StringGraphemeCount 21', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🗺️✈️'), 2)
})
Test('Should StringGraphemeCount 22', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🗺️a'), 2)
})
Test('Should StringGraphemeCount 23', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🗺️\u0301'), 1)
})
Test('Should StringGraphemeCount 24', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🇳🇿'), 1)
})
Test('Should StringGraphemeCount 25', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🇳🇿🇰🇷'), 2)
})
Test('Should StringGraphemeCount 26', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('NZ🇳🇿'), 3)
})
Test('Should StringGraphemeCount 27', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🇳🇿😄'), 2)
})
Test('Should StringGraphemeCount 28', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a😄e\u0301'), 3)
})
Test('Should StringGraphemeCount 29', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('😄🇳🇿e\u0301'), 3)
})
Test('Should StringGraphemeCount 30', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🧳🇰🇷abc'), 5)
})
Test('Should StringGraphemeCount 31', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a🇰🇷😄🗺️e\u0301'), 5)
})
Test('Should StringGraphemeCount 32', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🇳🇿🇰🇷🇯🇵'), 3)
})
Test('Should StringGraphemeCount 33', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a\u0301\u0323'), 1) // a + acute + dot below
})
Test('Should StringGraphemeCount 34', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('\u0301b'), 2) // combining mark + b
})
Test('Should StringGraphemeCount 35', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('\uDC00'), 1)
})
Test('Should StringGraphemeCount 36', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('🏝️🛳️'), 2)
})
Test('Should StringGraphemeCount 37', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('✈️🗺️'), 2)
})
Test('Should StringGraphemeCount 38', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('a🇳🇿🧳b'), 4)
})
Test('Should StringGraphemeCount 39', () => {
  Assert.IsEqual(Guard.StringGraphemeCount('𝄞𝄢𝄫'), 3) // multiple musical symbols (surrogate pairs)
})
