import { Value } from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Value.Patch')

// ----------------------------------------------------
// Scalars
// ----------------------------------------------------
Test('Should patch null to null', () => {
  const A = null
  const B = null
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch undefined to undefined', () => {
  const A = undefined
  const B = undefined
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch string to string', () => {
  const A = 'hello'
  const B = 'hello'
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch number to number', () => {
  const A = 1
  const B = 1
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch boolean to boolean', () => {
  const A = true
  const B = true
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch symbol to symbol', () => {
  const S = Symbol('A')
  const A = S
  const B = S
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch object to object', () => {
  const A = { x: 1, y: 2, z: 3 }
  const B = { x: 1, y: 2, z: 3 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch array to array', () => {
  const A = [1, 2, 3]
  const B = [1, 2, 3]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------
// Type Change Root
// ----------------------------------------------------
Test('Should patch TYPE change number to null', () => {
  const A = 1
  const B = null
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change null to undefined', () => {
  const A = null
  const B = undefined
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change null to number', () => {
  const A = null
  const B = 1
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change null to boolean', () => {
  const A = null
  const B = true
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change null to string', () => {
  const A = null
  const B = 'hello'
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change null to symbol', () => {
  const A = null
  const B = Symbol('A')
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change null to object', () => {
  const A = null
  const B = { x: 1, y: 1, z: 1 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change null to array', () => {
  const A = null
  const B = [1, 2, 3]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change object to array', () => {
  const A = { x: 1, y: 2 }
  const B = [1, 2, 3]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch TYPE change array to object', () => {
  const A = [1, 2, 3]
  const B = { x: 1, y: 2 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------
// Value Change Root
// ----------------------------------------------------
Test('Should patch VALUE change number', () => {
  const A = 1
  const B = 2
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch VALUE change boolean', () => {
  const A = false
  const B = true
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch VALUE change string', () => {
  const A = 'hello'
  const B = 'world'
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch VALUE change symbol', () => {
  const A = Symbol('A')
  const B = Symbol('B')
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------
// Array
// ----------------------------------------------------
Test('Should patch ELEMENT update', () => {
  const A = [1, 2, 3, 4]
  const B = [1, 2, 3, 9]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch ELEMENT push', () => {
  const A = [1, 2, 3, 4]
  const B = [1, 2, 3, 4, 5]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch ELEMENT push twice', () => {
  const A = [1, 2, 3, 4]
  const B = [1, 2, 3, 4, 5, 6]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch ELEMENT pop', () => {
  const A = [1, 2, 3, 4]
  const B = [1, 2, 3]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch ELEMENT pop twice', () => {
  const A = [1, 2, 3, 4]
  const B = [1, 2]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch ELEMENT unshift', () => {
  const A = [1, 2, 3, 4]
  const B = [2, 3, 4]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch ELEMENT unshift twice', () => {
  const A = [1, 2, 3, 4]
  const B = [3, 4]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------
// Object
// ----------------------------------------------------
Test('Should patch PROPERTY insert', () => {
  const A = { x: 1, y: 1 }
  const B = { x: 1, y: 1, z: 1 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch PROPERTY delete', () => {
  const A = { x: 1, y: 1, z: 1 }
  const B = { x: 1, y: 1 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch PROPERTY update', () => {
  const A = { x: 1, y: 1, z: 1 }
  const B = { x: 1, y: 1, z: 2 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch PROPERTY all values', () => {
  const A = { x: 1, y: 1, z: 1 }
  const B = { x: 2, y: 2, z: 2 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch PROPERTY all delete, all insert', () => {
  const A = { x: 1, y: 1, z: 1 }
  const B = { a: 2, b: 2, c: 2 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch PROPERTY update, insert and delete order preserved', () => {
  const A = { x: 1, y: 1, z: 1, w: 1 }
  const B = { a: 2, b: 2, c: 2, w: 2 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------
// Object Nested
// ----------------------------------------------------
Test('Should patch NESTED OBJECT diff type change update', () => {
  const A = { v: 1 }
  const B = { v: { x: 1, y: 1, z: 1 } }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED OBJECT diff value change update', () => {
  const A = { v: 1 }
  const B = { v: 2 }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED OBJECT diff partial property update', () => {
  const A = { v: { x: 1, y: 1, z: 1 } }
  const B = { v: { x: 2, y: 2, z: 2 } }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED OBJECT update, insert and delete order preserved', () => {
  const A = { v: { x: 1, y: 1 } }
  const B = { v: { x: 2, w: 2 } }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------
// Array Nested
// ----------------------------------------------------
Test('Should patch NESTED ARRAY object diff type change update', () => {
  const A = [{ v: 1 }]
  const B = [{ v: { x: 1, y: 1, z: 1 } }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED ARRAY object diff value change update', () => {
  const A = [{ v: 1 }]
  const B = [{ v: 2 }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED ARRAY object diff partial property update', () => {
  const A = [{ v: { x: 1, y: 1, z: 1 } }]
  const B = [{ v: { x: 2, y: 2, z: 2 } }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED ARRAY object diff partial property insert', () => {
  const A = [{ v: { x: 1, y: 1, z: 1 } }]
  const B = [{ v: { x: 1, y: 1, z: 1, w: 1 } }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED ARRAY object diff partial property delete', () => {
  const A = [{ v: { x: 1, y: 1, z: 1 } }]
  const B = [{ v: { x: 1, y: 1 } }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch NESTED ARRAY object ordered diff - update, insert and delete', () => {
  const A = [{ v: { x: 1, y: 1 } }]
  const B = [{ v: { x: 2, w: 2 } }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch Uint8Array (same size)', () => {
  const A = [{ v: new Uint8Array([0, 1, 3]) }]
  const B = [{ v: new Uint8Array([0, 1, 2]) }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch Uint8Array (less than size)', () => {
  const A = [{ v: new Uint8Array([0, 1, 3]) }]
  const B = [{ v: new Uint8Array([0, 1]) }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
Test('Should patch Uint8Array (greater than size)', () => {
  const A = [{ v: new Uint8Array([0, 1, 3]) }]
  const B = [{ v: new Uint8Array([0, 1, 2, 4]) }]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------
// Mega Values
// ----------------------------------------------------
Test('Should patch MEGA value', () => {
  const A = [
    { a: { x: 1, y: 1 } },
    { b: { x: 1, y: 1, z: ['hello', 1, 2] } },
    { c: { x: 1, y: 1 } },
    {
      d: [
        { a: 1 },
        { a: 1 },
        { a: 1 },
        [
          { a: { x: 1, y: 1 } },
          { b: { x: 1, y: 1, z: ['hello', true, true, 2] } },
          { c: { x: 1, y: 1 } },
          {
            d: [{ a: 1 }, { a: 1 }, { a: 1 }]
          }
        ]
      ]
    }
  ]
  const B = [
    1,
    2,
    { a: { x: 1, y: 'a' } },
    { b: { x: true, y: 1, z: ['hello', true, true] } },
    { c: { x: 1, y: 1 } },
    {
      d: [
        { a: 'hello' },
        1,
        2,
        { a: 1 },
        { a: 1 },
        [
          { a: { x: 1, y: 1 }, x: [1, 2, 3, 4] },
          { c: { x: 1, y: 1 } },
          {
            d: [{ a: 1 }, { a: 2 }, 'hello']
          }
        ]
      ]
    }
  ]
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/937
// ----------------------------------------------------------------
Test('Should generate no diff for undefined properties of current and next', () => {
  const A = { a: undefined }
  const B = { a: undefined }
  const D = Value.Diff(A, B)
  const P = Value.Patch(A, D)
  Assert.IsEqual(B, P)
})
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1419
// ----------------------------------------------------------------
Test('Should not result in sparse arrays', () => {
  const A = [1, 2, 3]
  const B = [1, 3]
  const D = Value.Diff(A, B)
  const E = Value.Patch(A, D) as unknown[]
  Assert.IsEqual(B, E)
  Assert.IsEqual(E.length, B.length)
})
// ----------------------------------------------------------------
// Pollution Guards: Ensure No Unsafe Property is Written
//
// https://github.com/sinclairzx81/typebox/pull/1593
// ----------------------------------------------------------------
Test('Should should throw if attempting to INSERT Unsafe properties', () => {
  Assert.IsEqual(
    Value.Patch({}, [
      { type: 'insert', path: '/value', value: 1 }
    ]),
    { value: 1 }
  )
  Assert.Throws(() =>
    Value.Patch({}, [
      { type: 'insert', path: '/constructor', value: 1 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({}, [
      { type: 'insert', path: '/prototype', value: 1 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({}, [
      { type: 'insert', path: '/__proto__', value: 1 }
    ])
  )
})
Test('Should should throw if attempting to DELETE Unsafe properties', () => {
  Assert.IsEqual(
    Value.Patch({ value: 1 }, [
      { type: 'delete', path: '/value' }
    ]),
    {}
  )
  Assert.Throws(() =>
    Value.Patch({ constructor: 1 }, [
      { type: 'delete', path: '/constructor' }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ prototype: 1 }, [
      { type: 'delete', path: '/prototype' }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ __proto__: 1 }, [
      { type: 'delete', path: '/__proto__' }
    ])
  )
})
Test('Should should throw if attempting to UPDATE Unsafe properties', () => {
  Assert.IsEqual(
    Value.Patch({ value: 1 }, [
      { type: 'update', path: '/value', value: 2 }
    ]),
    { value: 2 }
  )
  Assert.Throws(() =>
    Value.Patch({ constructor: 1 }, [
      { type: 'update', path: '/constructor', value: 2 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ prototype: 1 }, [
      { type: 'update', path: '/prototype', value: 2 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ __proto__: 1 }, [
      { type: 'update', path: '/__proto__', value: 2 }
    ])
  )
})
// ----------------------------------------------------------------
// Pollution Guards: Ensure No Unsafe Property is Written (Nested)
// ----------------------------------------------------------------
Test('Should should throw if attempting to INSERT Unsafe properties', () => {
  Assert.IsEqual(
    Value.Patch({ value: {} }, [
      { type: 'insert', path: '/value/x', value: 1 }
    ]),
    { value: { x: 1 } }
  )
  Assert.Throws(() =>
    Value.Patch({ constructor: {} }, [
      { type: 'insert', path: '/constructor/x', value: 1 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ prototype: {} }, [
      { type: 'insert', path: '/prototype/x', value: 1 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ __proto__: {} }, [
      { type: 'insert', path: '/__proto__/x', value: 1 }
    ])
  )
})
Test('Should should throw if attempting to DELETE Unsafe properties', () => {
  Assert.IsEqual(
    Value.Patch({ value: { x: 1 } }, [
      { type: 'delete', path: '/value/x' }
    ]),
    { value: {} }
  ) // {} not undefined
  Assert.Throws(() =>
    Value.Patch({ constructor: { x: 1 } }, [
      { type: 'delete', path: '/constructor/x' }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ prototype: { x: 1 } }, [
      { type: 'delete', path: '/prototype/x' }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ __proto__: { x: 1 } }, [
      { type: 'delete', path: '/__proto__/x' }
    ])
  )
})
Test('Should should throw if attempting to UPDATE Unsafe properties', () => {
  Assert.IsEqual(
    Value.Patch({ value: { x: 1 } }, [
      { type: 'update', path: '/value/x', value: 2 }
    ]),
    { value: { x: 2 } }
  )
  Assert.Throws(() =>
    Value.Patch({ constructor: { x: 1 } }, [
      { type: 'update', path: '/constructor/x', value: 2 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ prototype: { x: 1 } }, [
      { type: 'update', path: '/prototype/x', value: 2 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ __proto__: { x: 1 } }, [
      { type: 'update', path: '/__proto__/x', value: 2 }
    ])
  )
})
// ----------------------------------------------------------------
// Pollution Guards: Edge Cases
// ----------------------------------------------------------------
Test('Should throw if attempting to INSERT Unsafe properties at deep nested paths', () => {
  Assert.IsEqual(
    Value.Patch({ a: { b: {} } }, [
      { type: 'insert', path: '/a/b/x', value: 1 }
    ]),
    { a: { b: { x: 1 } } }
  )
  Assert.Throws(() =>
    Value.Patch({ a: { constructor: {} } }, [
      { type: 'insert', path: '/a/constructor/x', value: 1 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ a: { prototype: {} } }, [
      { type: 'insert', path: '/a/prototype/x', value: 1 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({ a: { __proto__: {} } }, [
      { type: 'insert', path: '/a/__proto__/x', value: 1 }
    ])
  )
})
Test('Should throw if path contains multiple Unsafe segments', () => {
  Assert.Throws(() =>
    Value.Patch({}, [
      { type: 'insert', path: '/constructor/prototype', value: 1 }
    ])
  )
  Assert.Throws(() =>
    Value.Patch({}, [
      { type: 'insert', path: '/__proto__/constructor', value: 1 }
    ])
  )
})
Test('Should not throw for property names that contain but do not equal Unsafe names', () => {
  Assert.IsEqual(
    Value.Patch({}, [
      { type: 'insert', path: '/my_constructor', value: 1 }
    ]),
    { my_constructor: 1 }
  )
  Assert.IsEqual(
    Value.Patch({}, [
      { type: 'insert', path: '/prototypes', value: 1 }
    ]),
    { prototypes: 1 }
  )
  Assert.IsEqual(
    Value.Patch({}, [
      { type: 'insert', path: '/not__proto__', value: 1 }
    ]),
    { not__proto__: 1 }
  )
})
