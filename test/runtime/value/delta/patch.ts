import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/delta/Patch', () => {
  // ----------------------------------------------------
  // Null
  // ----------------------------------------------------
  it('Should patch NULL null to null', () => {
    const A = null
    const B = null
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NULL undefined to undefined', () => {
    const A = undefined
    const B = undefined
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NULL string to string', () => {
    const A = 'hello'
    const B = 'hello'
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NULL number to number', () => {
    const A = 1
    const B = 1
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NULL boolean to boolean', () => {
    const A = true
    const B = true
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NULL symbol to symbol', () => {
    const S = Symbol('A')
    const A = S
    const B = S
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NULL object to object', () => {
    const A = { x: 1, y: 2, z: 3 }
    const B = { x: 1, y: 2, z: 3 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NULL array to array', () => {
    const A = [1, 2, 3]
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------
  // Type Change Root
  // ----------------------------------------------------
  it('Should patch TYPE change number to null', () => {
    const A = 1
    const B = null
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change null to undefined', () => {
    const A = null
    const B = undefined
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change null to number', () => {
    const A = null
    const B = 1
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change null to boolean', () => {
    const A = null
    const B = true
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change null to string', () => {
    const A = null
    const B = 'hello'
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change null to symbol', () => {
    const A = null
    const B = Symbol('A')
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change null to object', () => {
    const A = null
    const B = { x: 1, y: 1, z: 1 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change null to array', () => {
    const A = null
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change object to array', () => {
    const A = { x: 1, y: 2 }
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch TYPE change array to object', () => {
    const A = [1, 2, 3]
    const B = { x: 1, y: 2 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------
  // Value Change Root
  // ----------------------------------------------------
  it('Should patch VALUE change number', () => {
    const A = 1
    const B = 2
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch VALUE change boolean', () => {
    const A = false
    const B = true
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch VALUE change string', () => {
    const A = 'hello'
    const B = 'world'
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch VALUE change symbol', () => {
    const A = Symbol('A')
    const B = Symbol('B')
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------
  // Array
  // ----------------------------------------------------
  it('Should patch ELEMENT update', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 9]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch ELEMENT push', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 4, 5]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch ELEMENT push twice', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 4, 5, 6]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch ELEMENT pop', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch ELEMENT pop twice', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch ELEMENT unshift', () => {
    const A = [1, 2, 3, 4]
    const B = [2, 3, 4]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch ELEMENT unshift twice', () => {
    const A = [1, 2, 3, 4]
    const B = [3, 4]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------
  // Object
  // ----------------------------------------------------
  it('Should patch PROPERTY insert', () => {
    const A = { x: 1, y: 1 }
    const B = { x: 1, y: 1, z: 1 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch PROPERTY delete', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 1, y: 1 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch PROPERTY update', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 1, y: 1, z: 2 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch PROPERTY all values', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 2, y: 2, z: 2 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch PROPERTY all delete, all insert', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { a: 2, b: 2, c: 2 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch PROPERTY update, insert and delete order preserved', () => {
    const A = { x: 1, y: 1, z: 1, w: 1 }
    const B = { a: 2, b: 2, c: 2, w: 2 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------
  // Object Nested
  // ----------------------------------------------------
  it('Should patch NESTED OBJECT diff type change update', () => {
    const A = { v: 1 }
    const B = { v: { x: 1, y: 1, z: 1 } }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED OBJECT diff value change update', () => {
    const A = { v: 1 }
    const B = { v: 2 }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED OBJECT diff partial property update', () => {
    const A = { v: { x: 1, y: 1, z: 1 } }
    const B = { v: { x: 2, y: 2, z: 2 } }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED OBJECT update, insert and delete order preserved', () => {
    const A = { v: { x: 1, y: 1 } }
    const B = { v: { x: 2, w: 2 } }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------
  // Array Nested
  // ----------------------------------------------------
  it('Should patch NESTED ARRAY object diff type change update', () => {
    const A = [{ v: 1 }]
    const B = [{ v: { x: 1, y: 1, z: 1 } }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED ARRAY object diff value change update', () => {
    const A = [{ v: 1 }]
    const B = [{ v: 2 }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED ARRAY object diff partial property update', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 2, y: 2, z: 2 } }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED ARRAY object diff partial property insert', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 1, y: 1, z: 1, w: 1 } }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED ARRAY object diff partial property delete', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 1, y: 1 } }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch NESTED ARRAY object ordered diff - update, insert and delete', () => {
    const A = [{ v: { x: 1, y: 1 } }]
    const B = [{ v: { x: 2, w: 2 } }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch Uint8Array (same size)', () => {
    const A = [{ v: new Uint8Array([0, 1, 3]) }]
    const B = [{ v: new Uint8Array([0, 1, 2]) }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch Uint8Array (less than size)', () => {
    const A = [{ v: new Uint8Array([0, 1, 3]) }]
    const B = [{ v: new Uint8Array([0, 1]) }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  it('Should patch Uint8Array (greater than size)', () => {
    const A = [{ v: new Uint8Array([0, 1, 3]) }]
    const B = [{ v: new Uint8Array([0, 1, 2, 4]) }]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------
  // Mega Values
  // ----------------------------------------------------
  it('Should patch MEGA value', () => {
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
              d: [{ a: 1 }, { a: 1 }, { a: 1 }],
            },
          ],
        ],
      },
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
              d: [{ a: 1 }, { a: 2 }, 'hello'],
            },
          ],
        ],
      },
    ]
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/937
  // ----------------------------------------------------------------
  it('Should generate no diff for undefined properties of current and next', () => {
    const A = { a: undefined }
    const B = { a: undefined }
    const D = Value.Diff(A, B)
    const P = Value.Patch(A, D)
    Assert.IsEqual(B, P)
  })
})
