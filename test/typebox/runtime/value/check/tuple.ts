import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Tuple')

Test('Should validate tuple of [string, number]', () => {
  const A = Type.String()
  const B = Type.Number()
  const T = Type.Tuple([A, B])
  Ok(T, ['hello', 42])
})
Test('Should not validate tuple of [string, number] when reversed', () => {
  const A = Type.String()
  const B = Type.Number()
  const T = Type.Tuple([A, B])
  Fail(T, [42, 'hello'])
})
Test('Should validate with empty tuple', () => {
  const T = Type.Tuple([])
  Ok(T, [])
})
Test('Should not validate with empty tuple with more items', () => {
  const T = Type.Tuple([])
  Fail(T, [1])
})
Test('Should not validate with empty tuple with less items', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  Fail(T, [1])
})
Test('Should validate tuple of objects', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Object({ b: Type.Number() })
  const T = Type.Tuple([A, B])
  Ok(T, [{ a: 'hello' }, { b: 42 }])
})
Test('Should not validate tuple of objects when reversed', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Object({ b: Type.Number() })
  const T = Type.Tuple([A, B])
  Fail(T, [{ b: 42 }, { a: 'hello' }])
})
Test('Should not validate tuple when array is less than tuple length', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Object({ b: Type.Number() })
  const T = Type.Tuple([A, B])
  Fail(T, [{ a: 'hello' }])
})
Test('Should not validate tuple when array is greater than tuple length', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Object({ b: Type.Number() })
  const T = Type.Tuple([A, B])
  Fail(T, [{ a: 'hello' }, { b: 42 }, { b: 42 }])
})
// ------------------------------------------------------------------
// Coverage: PrefixItems | UnevaluatedItems Optimization
// ------------------------------------------------------------------
Test('Should use optimization logic for prefix items', () => {
  const T = Type.Tuple([Type.Literal(1), Type.Literal(2)], {
    prefixItems: [Type.Literal(1), Type.Literal(2)],
    unevaluatedItems: false
  })
  Ok(T, [1, 2])
  Fail(T, [1, 2, 3])
})
// ------------------------------------------------------------------
// Optional Elements
// ------------------------------------------------------------------
Test('Should validate tuple with optional elements at end - minimum items', () => {
  const T = Type.Tuple([
    Type.String(),
    Type.Number(),
    Type.Optional(Type.Boolean()),
    Type.Optional(Type.Null()),
  ])
  Ok(T, ['hello', 42]) // Only required items
  Ok(T, ['hello', 42, true]) // With one optional
  Ok(T, ['hello', 42, true, null]) // With all optional
})
Test('Should not validate tuple with optional elements when below minimum', () => {
  const T = Type.Tuple([
    Type.String(),
    Type.Number(),
    Type.Optional(Type.Boolean()),
    Type.Optional(Type.Null()),
  ])
  Fail(T, ['hello']) // Missing required item
  Fail(T, []) // Empty
})
Test('Should validate tuple with all optional elements', () => {
  const T = Type.Tuple([
    Type.Optional(Type.String()),
    Type.Optional(Type.Number()),
  ])
  Ok(T, []) // Empty is valid
  Ok(T, ['hello']) // One item
  Ok(T, ['hello', 42]) // All items
})
Test('Should not validate tuple with optional elements when exceeding max items', () => {
  const T = Type.Tuple([
    Type.String(),
    Type.Number(),
    Type.Optional(Type.Boolean()),
  ])
  Fail(T, ['hello', 42, true, 'extra']) // Too many items
})