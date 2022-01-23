import { Value, Edit } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

// -----------------------------------------------------------------
// Diff Factory
// -----------------------------------------------------------------

function Update(path: string, value: unknown): Edit<unknown> {
  return { type: 'update', path, value } as any
}

function Insert(path: string, value: unknown): Edit<unknown> {
  return { type: 'insert', path, value } as any
}

function Delete(path: string): Edit<unknown> {
  return { type: 'delete', path } as any
}

describe('value/delta/Diff', () => {
  // ----------------------------------------------------
  // Null
  // ----------------------------------------------------
  it('Should diff NULL null to null', () => {
    const A = null
    const B = null
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL undefined to undefined', () => {
    const A = undefined
    const B = undefined
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL string to string', () => {
    const A = 'hello'
    const B = 'hello'
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL number to number', () => {
    const A = 1
    const B = 1
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL boolean to boolean', () => {
    const A = true
    const B = true
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL symbol to symbol', () => {
    const S = Symbol('A')
    const A = S
    const B = S
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL object to object', () => {
    const A = { x: 1, y: 2, z: 3 }
    const B = { x: 1, y: 2, z: 3 }
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL array to array', () => {
    const A = [1, 2, 3]
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const E = [] as Edit[]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Type Change Root
  // ----------------------------------------------------

  it('Should diff TYPE change number to null', () => {
    const A = 1
    const B = null
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })

  it('Should diff TYPE change null to undefined', () => {
    const A = null
    const B = undefined
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to number', () => {
    const A = null
    const B = 1
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to boolean', () => {
    const A = null
    const B = true
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to string', () => {
    const A = null
    const B = 'hello'
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to symbol', () => {
    const A = null
    const B = Symbol('A')
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to object', () => {
    const A = null
    const B = { x: 1, y: 1, z: 1 }
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to array', () => {
    const A = null
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })
  // ----------------------------------------------------
  // Value Change Root
  // ----------------------------------------------------

  it('Should diff VALUE change number', () => {
    const A = 1
    const B = 2
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })

  it('Should diff VALUE change boolean', () => {
    const A = false
    const B = true
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })

  it('Should diff VALUE change string', () => {
    const A = 'hello'
    const B = 'world'
    const D = Value.Diff(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })

  it('Should diff VALUE change symbol', () => {
    const A = Symbol('A')
    const B = Symbol('B')
    const D = Value.Diff<any>(A, B)
    const E = [Update('', B)]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Array
  // ----------------------------------------------------

  it('Should diff ELEMENT update', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 9]
    const D = Value.Diff(A, B)
    const E = [Update('/3', 9)]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT push', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 4, 5]
    const D = Value.Diff(A, B)
    const E = [Insert('/4', 5)]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT push twice', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 4, 5, 6]
    const D = Value.Diff(A, B)
    const E = [Insert('/4', 5), Insert('/5', 6)]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT pop', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const E = [Delete('/3')]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT pop twice', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2]
    const D = Value.Diff(A, B)
    const E = [Delete('/3'), Delete('/2')]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT unshift', () => {
    const A = [1, 2, 3, 4]
    const B = [2, 3, 4]
    const D = Value.Diff(A, B)
    const E = [Update('/0', 2), Update('/1', 3), Update('/2', 4), Delete('/3')]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT unshift twice', () => {
    const A = [1, 2, 3, 4]
    const B = [3, 4]
    const D = Value.Diff(A, B)
    const E = [Update('/0', 3), Update('/1', 4), Delete('/3'), Delete('/2')]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Object
  // ----------------------------------------------------

  it('Should diff PROPERTY insert', () => {
    const A = { x: 1, y: 1 }
    const B = { x: 1, y: 1, z: 1 }
    const D = Value.Diff(A, B)
    const E = [Insert('/z', 1)]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY delete', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 1, y: 1 }
    const D = Value.Diff(A, B)
    const E = [Delete('/z')]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY update', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 1, y: 1, z: 2 }
    const D = Value.Diff(A, B)
    const E = [Update('/z', 2)]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY all values', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 2, y: 2, z: 2 }
    const D = Value.Diff(A, B)
    const E = [Update('/x', 2), Update('/y', 2), Update('/z', 2)]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY all delete, all insert', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { a: 2, b: 2, c: 2 }
    const D = Value.Diff<any>(A, B)
    const E = [Insert('/a', 2), Insert('/b', 2), Insert('/c', 2), Delete('/z'), Delete('/y'), Delete('/x')]
    Assert.deepEqual(D, E)
  })

  it('Should diff PROPERTY update, insert and delete order preserved', () => {
    const A = { x: 1, y: 1, z: 1, w: 1 }
    const B = { a: 2, b: 2, c: 2, w: 2 }
    const D = Value.Diff<any>(A, B)
    const E = [Update('/w', 2), Insert('/a', 2), Insert('/b', 2), Insert('/c', 2), Delete('/z'), Delete('/y'), Delete('/x')]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Object Nested
  // ----------------------------------------------------

  it('Should diff NESTED OBJECT diff type change update', () => {
    const A = { v: 1 }
    const B = { v: { x: 1, y: 1, z: 1 } }
    const D = Value.Diff<any>(A, B)
    const E = [Update('/v', B.v)]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED OBJECT diff value change update', () => {
    const A = { v: 1 }
    const B = { v: 2 }
    const D = Value.Diff(A, B)
    const E = [Update('/v', B.v)]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED OBJECT diff partial property update', () => {
    const A = { v: { x: 1, y: 1, z: 1 } }
    const B = { v: { x: 2, y: 2, z: 2 } }
    const D = Value.Diff(A, B)
    const E = [Update('/v/x', B.v.x), Update('/v/y', B.v.y), Update('/v/z', B.v.z)]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED OBJECT diff partial property insert', () => {
    const A = { v: { x: 1, y: 1, z: 1 } }
    const B = { v: { x: 1, y: 1, z: 1, w: 1 } }
    const D = Value.Diff(A, B)
    const E = [Insert('/v/w', B.v.w)]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED OBJECT diff partial property delete', () => {
    const A = { v: { x: 1, y: 1, z: 1 } }
    const B = { v: { x: 1, y: 1 } }
    const D = Value.Diff(A, B)
    const E = [Delete('/v/z')]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED OBJECT ordered diff - update, insert and delete', () => {
    const A = { v: { x: 1, y: 1 } }
    const B = { v: { x: 2, w: 2 } }
    const D = Value.Diff<any>(A, B)
    const E = [Update('/v/x', B.v.x), Insert('/v/w', B.v.w), Delete('/v/y')]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Array Nested
  // ----------------------------------------------------

  it('Should diff NESTED ARRAY object diff type change update', () => {
    const A = [{ v: 1 }]
    const B = [{ v: { x: 1, y: 1, z: 1 } }]
    const D = Value.Diff<any>(A, B)
    const E = [Update('/0/v', B[0].v)]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED ARRAY object diff value change update', () => {
    const A = [{ v: 1 }]
    const B = [{ v: 2 }]
    const D = Value.Diff(A, B)
    const E = [Update('/0/v', B[0].v)]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED ARRAY object diff partial property update', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 2, y: 2, z: 2 } }]
    const D = Value.Diff(A, B)
    const E = [Update('/0/v/x', B[0].v.x), Update('/0/v/y', B[0].v.y), Update('/0/v/z', B[0].v.z)]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED ARRAY object diff partial property insert', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 1, y: 1, z: 1, w: 1 } }]
    const D = Value.Diff(A, B)
    const E = [Insert('/0/v/w', B[0].v.w)]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED ARRAY object diff partial property delete', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 1, y: 1 } }]
    const D = Value.Diff(A, B)
    const E = [Delete('/0/v/z')]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED ARRAY update, insert and delete order preserved', () => {
    const A = [{ v: { x: 1, y: 1 } }]
    const B = [{ v: { x: 2, w: 2 } }]
    const D = Value.Diff<any>(A, B)
    const E = [Update('/0/v/x', B[0].v.x), Insert('/0/v/w', B[0].v.w), Delete('/0/v/y')]
    Assert.deepEqual(D, E)
  })

  it('Should throw if attempting to diff a current value with symbol key', () => {
    const A = [{ [Symbol('A')]: 1, v: { x: 1, y: 1 } }]
    const B = [{ v: { x: 2, w: 2 } }]
    Assert.throws(() => Value.Diff<any>(A, B))
  })

  it('Should throw if attempting to diff a next value with symbol key', () => {
    const A = [{ v: { x: 1, y: 1 } }]
    const B = [{ [Symbol('A')]: 1, v: { x: 2, w: 2 } }]
    Assert.throws(() => Value.Diff<any>(A, B))
  })

  it('Should diff a Uint8Array (same size)', () => {
    const A = new Uint8Array([0, 1, 2, 3])
    const B = new Uint8Array([0, 9, 2, 9])
    const D = Value.Diff(A, B)
    const E = [Update('/1', 9), Update('/3', 9)]
    Assert.deepEqual(D, E)
  })

  it('Should diff a Uint8Array (less than requires full update)', () => {
    const A = new Uint8Array([0, 1, 2, 3])
    const B = new Uint8Array([0, 9, 2])
    const D = Value.Diff(A, B)
    const E = [Update('', new Uint8Array([0, 9, 2]))]
    Assert.deepEqual(D, E)
  })

  it('Should diff a Uint8Array (greater than requires full update)', () => {
    const A = new Uint8Array([0, 1, 2, 3])
    const B = new Uint8Array([0, 9, 2, 3, 4])
    const D = Value.Diff(A, B)
    const E = [Update('', new Uint8Array([0, 9, 2, 3, 4]))]
    Assert.deepEqual(D, E)
  })
})
