import { Value, EditType } from '@sidewinder/value'
import { Assert } from '../../assert/index'

describe('value/delta/Diff', () => {
  // ----------------------------------------------------
  // Null
  // ----------------------------------------------------
  it('Should diff NULL null to null', () => {
    const A = null
    const B = null
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL undefined to undefined', () => {
    const A = undefined
    const B = undefined
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL string to string', () => {
    const A = 'hello'
    const B = 'hello'
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL number to number', () => {
    const A = 1
    const B = 1
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL boolean to boolean', () => {
    const A = true
    const B = true
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL symbol to symbol', () => {
    const S = Symbol('A')
    const A = S
    const B = S
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL object to object', () => {
    const A = { x: 1, y: 2, z: 3 }
    const B = { x: 1, y: 2, z: 3 }
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })
  it('Should diff NULL array to array', () => {
    const A = [1, 2, 3]
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const E = [] as any[]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Type Change Root
  // ----------------------------------------------------

  it('Should diff TYPE change number to null', () => {
    const A = 1
    const B = null
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })

  it('Should diff TYPE change null to undefined', () => {
    const A = null
    const B = undefined
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to number', () => {
    const A = null
    const B = 1
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to boolean', () => {
    const A = null
    const B = true
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to string', () => {
    const A = null
    const B = 'hello'
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to symbol', () => {
    const A = null
    const B = Symbol('A')
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to object', () => {
    const A = null
    const B = { x: 1, y: 1, z: 1 }
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })
  it('Should diff TYPE change null to array', () => {
    const A = null
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })
  // ----------------------------------------------------
  // Value Change Root
  // ----------------------------------------------------

  it('Should diff VALUE change number', () => {
    const A = 1
    const B = 2
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })

  it('Should diff VALUE change boolean', () => {
    const A = false
    const B = true
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })

  it('Should diff VALUE change string', () => {
    const A = 'hello'
    const B = 'world'
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })

  it('Should diff VALUE change symbol', () => {
    const A = Symbol('A')
    const B = Symbol('B')
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '', B]]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Array
  // ----------------------------------------------------

  it('Should diff ELEMENT update', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 9]
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '/3', 9]]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT push', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 4, 5]
    const D = Value.Diff(A, B)
    const E = [[EditType.Insert, '/4', 5]]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT push twice', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3, 4, 5, 6]
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Insert, '/4', 5],
      [EditType.Insert, '/5', 6],
    ]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT pop', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2, 3]
    const D = Value.Diff(A, B)
    const E = [[EditType.Delete, '/3']]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT pop twice', () => {
    const A = [1, 2, 3, 4]
    const B = [1, 2]
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Delete, '/3'],
      [EditType.Delete, '/2'],
    ]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT unshift', () => {
    const A = [1, 2, 3, 4]
    const B = [2, 3, 4]
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/0', 2],
      [EditType.Update, '/1', 3],
      [EditType.Update, '/2', 4],
      [EditType.Delete, '/3'],
    ]
    Assert.deepEqual(D, E)
  })

  it('Should diff ELEMENT unshift twice', () => {
    const A = [1, 2, 3, 4]
    const B = [3, 4]
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/0', 3],
      [EditType.Update, '/1', 4],
      [EditType.Delete, '/3'],
      [EditType.Delete, '/2'],
    ]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Object
  // ----------------------------------------------------

  it('Should diff PROPERTY insert', () => {
    const A = { x: 1, y: 1 }
    const B = { x: 1, y: 1, z: 1 }
    const D = Value.Diff(A, B)
    const E = [[EditType.Insert, '/z', 1]]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY delete', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 1, y: 1 }
    const D = Value.Diff(A, B)
    const E = [[EditType.Delete, '/z']]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY update', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 1, y: 1, z: 2 }
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '/z', 2]]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY all values', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { x: 2, y: 2, z: 2 }
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/x', 2],
      [EditType.Update, '/y', 2],
      [EditType.Update, '/z', 2],
    ]
    Assert.deepEqual(D, E)
  })
  it('Should diff PROPERTY all delete, all insert', () => {
    const A = { x: 1, y: 1, z: 1 }
    const B = { a: 2, b: 2, c: 2 }
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Insert, '/a', 2],
      [EditType.Insert, '/b', 2],
      [EditType.Insert, '/c', 2],
      [EditType.Delete, '/z'],
      [EditType.Delete, '/y'],
      [EditType.Delete, '/x'],
    ]
    Assert.deepEqual(D, E)
  })

  it('Should diff PROPERTY update, insert and delete order preserved', () => {
    const A = { x: 1, y: 1, z: 1, w: 1 }
    const B = { a: 2, b: 2, c: 2, w: 2 }
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/w', 2],
      [EditType.Insert, '/a', 2],
      [EditType.Insert, '/b', 2],
      [EditType.Insert, '/c', 2],
      [EditType.Delete, '/z'],
      [EditType.Delete, '/y'],
      [EditType.Delete, '/x'],
    ]
    Assert.deepEqual(D, E)
  })
  // ----------------------------------------------------
  // Object Nested
  // ----------------------------------------------------

  it('Should diff NESTED OBJECT diff type change update', () => {
    const A = { v: 1 }
    const B = { v: { x: 1, y: 1, z: 1 } }
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '/v', B.v]]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED OBJECT diff value change update', () => {
    const A = { v: 1 }
    const B = { v: 2 }
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '/v', B.v]]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED OBJECT diff partial property update', () => {
    const A = { v: { x: 1, y: 1, z: 1 } }
    const B = { v: { x: 2, y: 2, z: 2 } }
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/v/x', B.v.x],
      [EditType.Update, '/v/y', B.v.y],
      [EditType.Update, '/v/z', B.v.z],
    ]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED OBJECT diff partial property insert', () => {
    const A = { v: { x: 1, y: 1, z: 1 } }
    const B = { v: { x: 1, y: 1, z: 1, w: 1 } }
    const D = Value.Diff(A, B)
    const E = [[EditType.Insert, '/v/w', B.v.w]]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED OBJECT diff partial property delete', () => {
    const A = { v: { x: 1, y: 1, z: 1 } }
    const B = { v: { x: 1, y: 1 } }
    const D = Value.Diff(A, B)
    const E = [[EditType.Delete, '/v/z']]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED OBJECT ordered diff - update, insert and delete', () => {
    const A = { v: { x: 1, y: 1 } }
    const B = { v: { x: 2, w: 2 } }
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/v/x', B.v.x],
      [EditType.Insert, '/v/w', B.v.w],
      [EditType.Delete, '/v/y'],
    ]
    Assert.deepEqual(D, E)
  })

  // ----------------------------------------------------
  // Array Nested
  // ----------------------------------------------------

  it('Should diff NESTED ARRAY object diff type change update', () => {
    const A = [{ v: 1 }]
    const B = [{ v: { x: 1, y: 1, z: 1 } }]
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '/0/v', B[0].v]]
    Assert.deepEqual(D, E)
  })

  it('Should diff NESTED ARRAY object diff value change update', () => {
    const A = [{ v: 1 }]
    const B = [{ v: 2 }]
    const D = Value.Diff(A, B)
    const E = [[EditType.Update, '/0/v', B[0].v]]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED ARRAY object diff partial property update', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 2, y: 2, z: 2 } }]
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/0/v/x', B[0].v.x],
      [EditType.Update, '/0/v/y', B[0].v.y],
      [EditType.Update, '/0/v/z', B[0].v.z],
    ]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED ARRAY object diff partial property insert', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 1, y: 1, z: 1, w: 1 } }]
    const D = Value.Diff(A, B)
    const E = [[EditType.Insert, '/0/v/w', B[0].v.w]]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED ARRAY object diff partial property delete', () => {
    const A = [{ v: { x: 1, y: 1, z: 1 } }]
    const B = [{ v: { x: 1, y: 1 } }]
    const D = Value.Diff(A, B)
    const E = [[EditType.Delete, '/0/v/z']]
    Assert.deepEqual(D, E)
  })
  it('Should diff NESTED ARRAY update, insert and delete order preserved', () => {
    const A = [{ v: { x: 1, y: 1 } }]
    const B = [{ v: { x: 2, w: 2 } }]
    const D = Value.Diff(A, B)
    const E = [
      [EditType.Update, '/0/v/x', B[0].v.x],
      [EditType.Insert, '/0/v/w', B[0].v.w],
      [EditType.Delete, '/0/v/y'],
    ]
    Assert.deepEqual(D, E)
  })
})
