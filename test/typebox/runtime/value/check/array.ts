import { Type } from 'typebox'
import { Fail, Ok } from './~validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Array')

Test('Should validate an array of any', () => {
  const T = Type.Array(Type.Any())
  Ok(T, [0, true, 'hello', {}])
})
Test('Should not validate varying array when item is number', () => {
  const T = Type.Array(Type.Number())
  Fail(T, [1, 2, 3, 'hello'])
})
Test('Should validate for an array of unions', () => {
  const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
  Ok(T, [1, 'hello', 3, 'world'])
})
Test('Should not validate for an array of unions where item is not in union.', () => {
  const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
  Fail(T, [1, 'hello', 3, 'world', true])
})
Test('Should validate for an empty array', () => {
  const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
  Ok(T, [])
})
Test('Should validate for an array of intersection types', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Object({ b: Type.String() })
  const C = Type.Intersect([A, B])
  const T = Type.Array(C)
  Ok(T, [
    { a: 'hello', b: 'hello' },
    { a: 'hello', b: 'hello' },
    { a: 'hello', b: 'hello' }
  ])
})
Test('Should validate an array of tuples', () => {
  const A = Type.String()
  const B = Type.Number()
  const C = Type.Tuple([A, B])
  const T = Type.Array(C)
  Ok(T, [
    ['hello', 1],
    ['hello', 1],
    ['hello', 1]
  ])
})
Test('Should not validate an array of tuples when tuple values are incorrect', () => {
  const A = Type.String()
  const B = Type.Number()
  const C = Type.Tuple([A, B])
  const T = Type.Array(C)
  Fail(T, [
    [1, 'hello'],
    [1, 'hello'],
    [1, 'hello']
  ])
})
Test('Should not validate array with failed minItems', () => {
  const T = Type.Array(Type.Number(), { minItems: 3 })
  Fail(T, [0, 1])
})
Test('Should not validate array with failed maxItems', () => {
  const T = Type.Array(Type.Number(), { maxItems: 3 })
  Fail(T, [0, 1, 2, 3])
})
// ---------------------------------------------------------
// Unique Items
// ---------------------------------------------------------
Test('Should validate array with uniqueItems when items are distinct objects', () => {
  const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
  Ok(T, [
    { x: 0, y: 1 },
    { x: 1, y: 0 }
  ])
})
Test('Should not validate array with uniqueItems when items are not distinct objects', () => {
  const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
  Fail(T, [
    { x: 1, y: 0 },
    { x: 1, y: 0 }
  ])
})
Test('Should not validate array with non uniqueItems', () => {
  const T = Type.Array(Type.Number(), { uniqueItems: true })
  Fail(T, [0, 0])
})
// ---------------------------------------------------------
// Contains
// ---------------------------------------------------------
Test('Should validate for contains', () => {
  const T = Type.Array(Type.Number(), { contains: Type.Literal(1) })
  Ok(T, [1])
  Ok(T, [1, 2])
  Fail(T, [])
  Fail(T, [2])
})
Test('Should validate for minContains', () => {
  const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3 })
  Ok(T, [1, 1, 1, 2])
  Ok(T, [2, 1, 1, 1, 2])
  Ok(T, [1, 1, 1])
  Fail(T, [])
  Fail(T, [1, 1])
  Fail(T, [2])
})
Test('Should validate for maxContains', () => {
  const T = Type.Array(Type.Number(), { contains: Type.Literal(1), maxContains: 3 })
  Ok(T, [1, 1, 1])
  Ok(T, [1, 1])
  Ok(T, [2, 2, 2, 2, 1, 1, 1])
  Fail(T, [1, 1, 1, 1])
})
Test('Should validate for minContains and maxContains', () => {
  const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3, maxContains: 5 })
  Fail(T, [1, 1])
  Ok(T, [1, 1, 1])
  Ok(T, [1, 1, 1, 1])
  Ok(T, [1, 1, 1, 1, 1])
  Fail(T, [1, 1, 1, 1, 1, 1])
})
Test('Should validate minContains or maxContains when contains is unspecified', () => {
  const T = Type.Array(Type.Number(), { minContains: 3, maxContains: 5 })
  Ok(T, [1, 1])
  Ok(T, [1, 1, 1])
  Ok(T, [1, 1, 1, 1])
  Ok(T, [1, 1, 1, 1, 1])
  Ok(T, [1, 1, 1, 1, 1, 1])
})
Test('Should produce illogical schema when contains is not sub type of items', () => {
  const T = Type.Array(Type.Number(), { contains: Type.String(), minContains: 3, maxContains: 5 })
  Fail(T, [1, 1])
  Fail(T, [1, 1, 1])
  Fail(T, [1, 1, 1, 1])
  Fail(T, [1, 1, 1, 1, 1])
  Fail(T, [1, 1, 1, 1, 1, 1])
})
// ----------------------------------------------------------------
// Contains: https://github.com/sinclairzx81/typebox/pull/1655
// ----------------------------------------------------------------
Test('Should treat contains-matched items as evaluated for unevaluatedItems', () => {
  const T = Type.Unsafe({ type: 'array', contains: Type.String(), unevaluatedItems: false })
  Ok(T, ['foo'])
  Ok(T, ['foo', 'bar'])
  Fail(T, ['foo', 1])
  Fail(T, [1])
})
// ----------------------------------------------------------------
// Issue: https://github.com/sinclairzx81/typebox/discussions/607
// ----------------------------------------------------------------
Test('Should correctly handle undefined array properties', () => {
  const Answer = Type.Object({
    text: Type.String(),
    isCorrect: Type.Boolean()
  })
  const Question = Type.Object({
    text: Type.String(),
    options: Type.Array(Answer, {
      minContains: 1,
      maxContains: 1,
      contains: Type.Object({
        text: Type.String(),
        isCorrect: Type.Literal(true)
      })
    })
  })
  Fail(Question, { text: 'A' })
  Fail(Question, { text: 'A', options: [] })
  Ok(Question, { text: 'A', options: [{ text: 'A', isCorrect: true }] })
  Ok(Question, {
    text: 'A',
    options: [
      { text: 'A', isCorrect: true },
      { text: 'B', isCorrect: false }
    ]
  })
  Fail(Question, { text: 'A', options: [{ text: 'A', isCorrect: false }] })
  Fail(Question, {
    text: 'A',
    options: [
      { text: 'A', isCorrect: true },
      { text: 'B', isCorrect: true }
    ]
  })
})
// ----------------------------------------------------------------
// SparseArray
//
// TypeBox validates arrays using .every() and .some(). Per
// ECMA262, these methods skip <empty> elements when enumerating
// a sparse array. As a result, TypeBox never visits empty
// elements, and cannot validate values it never visits. These
// tests assert array validation behavior for sparse arrays.
//
// ----------------------------------------------------------------
Test('Should handle sparse array 1', () => {
  const T = Type.Array(Type.Number())
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  Ok(T, A) //                 ok: is array, but no elements were visited
})
Test('Should handle sparse array 2', () => {
  const T = Type.Array(Type.Number())
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  Ok(T, A) //                 ok: is array, one element is number
})
Test('Should handle sparse array 3', () => {
  const T = Type.Array(Type.Number())
  const A = new Array(3) // [<empty>, <empty>, <empty>]
  A[1] = 'x' //             [<empty>, 'x', <empty>]
  Fail(T, A) //             fail: is array, no number elements
})
Test('Should handle sparse array 4', () => {
  const T = Type.Array(Type.Number())
  const A = new Array(3) // [<empty>, <empty>, <empty>]
  A[1] = 'x' //             [<empty>, 'x', <empty>]
  A[2] = 1 //               [<empty>, 'x', 1]
  Fail(T, A) //             fail: is array, one number element, failed due to string
})
Test('Should handle sparse array 5', () => {
  const T = Type.Array(Type.Number())
  const A = new Array(3) // [<empty>, <empty>, <empty>]
  A[1] = 1 //               [<empty>, 1, <empty>]
  A[2] = 'x' //             [<empty>, 1, 'x']
  Fail(T, A) //             fail: is array, one number element, failed due to string
})
// ----------------------------------------------------------------
// SparseArray: MinItems
//
// TypeBox checks array size using the array's `.length`
// property. This check is unaffected by sparseness, since
// `.length` includes empty elements. A sparse array can
// therefore satisfy minItems even though enumeration only
// visits its non-empty elements.
//
// ----------------------------------------------------------------
Test('Should handle sparse array minItems 1', () => {
  const T = Type.Array(Type.Number(), { minItems: 1 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  Ok(T, A) //                 ok: is array, array.length === 3
})
Test('Should handle sparse array minItems 2', () => {
  const T = Type.Array(Type.Number(), { minItems: 1 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  Ok(T, A) //                 ok: is array, array.length === 3
})
// ----------------------------------------------------------------
// SparseArray: MaxItems
//
// TypeBox checks array size using the array's `.length`
// property. This check is unaffected by sparseness, since
// `.length` includes empty elements. A sparse array can
// therefore fail maxItems even though enumeration only
// visits its non-empty elements.
//
// ----------------------------------------------------------------
Test('Should handle sparse array maxItems 1', () => {
  const T = Type.Array(Type.Number(), { maxItems: 2 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  Fail(T, A) //                fail: is array, array.length === 3
})
Test('Should handle sparse array maxItems 2', () => {
  const T = Type.Array(Type.Number(), { maxItems: 2 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  Fail(T, A) //                fail: is array, array.length === 3
})
Test('Should handle sparse array maxItems 3', () => {
  const T = Type.Array(Type.Number(), { maxItems: 3 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  Ok(T, A) //                  ok: is array, array.length === 3
})
Test('Should handle sparse array maxItems 4', () => {
  const T = Type.Array(Type.Number(), { maxItems: 3 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  Ok(T, A) //                  ok: is array, array.length === 3
})
// ----------------------------------------------------------------
// SparseArray: Undefined is Not Empty
//
// A sparse array hole (<empty>) is not the same as an element
// explicitly set to undefined. An <empty> element has no key on
// the array and is skipped during enumeration. An element set to
// undefined does have a key, so it is visited during enumeration
// and is validated like any other element.
//
// ----------------------------------------------------------------
Test('Should handle undefined is not empty 1', () => {
  const T = Type.Array(Type.Undefined())
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  Ok(T, A) //                 ok: all elements are <empty>, none are visited
})
Test('Should handle undefined is not empty 2', () => {
  const T = Type.Array(Type.Undefined())
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = undefined //         [<empty>, undefined, <empty>]
  Ok(T, A) //                 ok: element at index 1 is visited, undefined matches Type.Undefined()
})
Test('Should handle undefined is not empty 3', () => {
  const T = Type.Array(Type.Undefined())
  const A = [undefined, undefined, undefined] // not sparse, all keys exist
  Ok(T, A) //                 ok: all elements are visited, all match Type.Undefined()
})
Test('Should handle undefined is not empty 4', () => {
  const T = Type.Array(Type.Number())
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  Ok(T, A) //                 ok: all elements are <empty>, none are visited
})
Test('Should handle undefined is not empty 5', () => {
  const T = Type.Array(Type.Number())
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = undefined //         [<empty>, undefined, <empty>]
  Fail(T, A) //               fail: element at index 1 is visited, undefined is not a number
})
Test('Should handle undefined is not empty 6', () => {
  const T = Type.Array(Type.Number())
  const A = [undefined, undefined, undefined] // not sparse, all keys exist
  Fail(T, A) //               fail: all elements are visited, none are numbers
})
// ----------------------------------------------------------------
// SparseArray: Contains
//
// TypeBox checks contains by testing whether at least one
// enumerated element matches the contains schema. Since
// enumeration skips <empty> elements, a hole can never satisfy
// contains. A sparse array only satisfies contains if one of its
// non-empty elements matches the schema.
//
// ----------------------------------------------------------------
Test('Should handle sparse array contains 1', () => {
  const T = Type.Array(Type.Unknown(), { contains: Type.Number() })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  Fail(T, A) //               fail: no elements are visited, contains is never matched
})
Test('Should handle sparse array contains 2', () => {
  const T = Type.Array(Type.Unknown(), { contains: Type.Number() })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  Ok(T, A) //                 ok: element at index 1 is visited and matches contains
})
Test('Should handle sparse array contains 3', () => {
  const T = Type.Array(Type.Unknown(), { contains: Type.Number() })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 'x' //               [<empty>, 'x', <empty>]
  Fail(T, A) //               fail: element at index 1 is visited but does not match contains
})
// ----------------------------------------------------------------
// SparseArray: MinContains
//
// TypeBox checks minContains by counting how many enumerated
// elements match the contains schema. Since enumeration skips
// <empty> elements, a hole can never count toward this total. A
// sparse array only reaches minContains through its non-empty
// elements.
//
// ----------------------------------------------------------------
Test('Should handle sparse array minContains 1', () => {
  const T = Type.Array(Type.Unknown(), { contains: Type.Number(), minContains: 2 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  Fail(T, A) //               fail: only one visited element matches, minContains requires 2
})
Test('Should handle sparse array minContains 2', () => {
  const T = Type.Array(Type.Unknown(), { contains: Type.Number(), minContains: 2 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  A[2] = 2 //                 [<empty>, 1, 2]
  Ok(T, A) //                 ok: two visited elements match, satisfies minContains
})
// ----------------------------------------------------------------
// SparseArray: MaxContains
//
// TypeBox checks maxContains by counting how many enumerated
// elements match the contains schema. Since enumeration skips
// <empty> elements, a hole can never count toward this total. A
// sparse array can only exceed maxContains through its non-empty
// elements.
//
// ----------------------------------------------------------------
Test('Should handle sparse array maxContains 1', () => {
  const T = Type.Array(Type.Unknown(), { contains: Type.Number(), maxContains: 1 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  Ok(T, A) //                 ok: one visited element matches, satisfies maxContains
})
Test('Should handle sparse array maxContains 2', () => {
  const T = Type.Array(Type.Unknown(), { contains: Type.Number(), maxContains: 1 })
  const A = new Array(3) //   [<empty>, <empty>, <empty>]
  A[1] = 1 //                 [<empty>, 1, <empty>]
  A[2] = 2 //                 [<empty>, 1, 2]
  Fail(T, A) //               fail: two visited elements match, exceeds maxContains
})
