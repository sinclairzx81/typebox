import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/clone/Clone', () => {
  // --------------------------------------------
  // ValueType
  // --------------------------------------------
  it('Should clone null', () => {
    const R = Value.Clone(null)
    Assert.IsEqual(R, null)
  })
  it('Should clone undefined', () => {
    const R = Value.Clone(undefined)
    Assert.IsEqual(R, undefined)
  })
  it('Should clone number', () => {
    const R = Value.Clone(1)
    Assert.IsEqual(R, 1)
  })
  it('Should clone bigint', () => {
    const R = Value.Clone(1n)
    Assert.IsEqual(R, 1n)
  })
  it('Should clone boolean', () => {
    const R = Value.Clone(true)
    Assert.IsEqual(R, true)
  })
  it('Should clone string', () => {
    const R = Value.Clone('hello')
    Assert.IsEqual(R, 'hello')
  })
  it('Should clone symbol', () => {
    const S = Symbol('hello')
    const R = Value.Clone(S)
    Assert.IsEqual(R, S)
  })
  // --------------------------------------------
  // ObjectType
  // --------------------------------------------
  it('Should clone object #1', () => {
    const V = {
      x: 1,
      y: 2,
      z: 3,
    }
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone object #2', () => {
    const V = {
      x: 1,
      y: 2,
      z: 3,
      w: {
        a: 1,
        b: 2,
        c: 3,
      },
    }
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone object #3', () => {
    const V = {
      x: 1,
      y: 2,
      z: 3,
      w: [0, 1, 2, 3, 4],
    }
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  // --------------------------------------------
  // ArrayType
  // --------------------------------------------
  it('Should clone array #1', () => {
    const V = [1, 2, 3, 4]
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone array #2', () => {
    const V = [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ]
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone array #3', () => {
    const V = [
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
    ]
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Int8Array', () => {
    const V = new Int8Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Uint8Array', () => {
    const V = new Uint8Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Uint8ClampedArray', () => {
    const V = new Uint8ClampedArray([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Int16Array', () => {
    const V = new Int16Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Uint16Array', () => {
    const V = new Uint16Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Int32Array', () => {
    const V = new Int32Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Uint32Array', () => {
    const V = new Int32Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Float32Array', () => {
    const V = new Float32Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone Float64Array', () => {
    const V = new Float64Array([1, 2, 3, 4])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone BigInt64Array', () => {
    const V = new BigInt64Array([1n, 2n, 3n, 4n])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should clone BigUint64Array', () => {
    const V = new BigUint64Array([1n, 2n, 3n, 4n])
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  // ------------------------------------------------------------------------
  // ref: https://github.com/sinclairzx81/typebox/issues/1300
  // ------------------------------------------------------------------------
  it('Should handle circular references #1', () => {
    const V = { a: 1, b: { c: 2 } } as any
    V.b.d = V.b
    const R = Value.Clone(V)
    Assert.IsEqual(R, V)
  })
  it('Should handle circular references #2', () => {
    const V = { a: {}, b: {} } as any
    V.a.c = V.b
    V.b.d = V.a
    const R = Value.Clone(V)
    console.log(R)
    Assert.IsEqual(R, V)
  })
  it('Should handle indirect circular references #1', () => {
    // Create a chain: A -> B -> C -> A
    const A = { name: 'A' } as any
    const B = { name: 'B' } as any
    const C = { name: 'C' } as any

    A.next = B
    B.next = C
    C.next = A // Circular reference through chain

    const R = Value.Clone(A)
    Assert.IsEqual(R.name, 'A')
    Assert.IsEqual(R.next.name, 'B')
    Assert.IsEqual(R.next.next.name, 'C')
    Assert.IsEqual(R.next.next.next, R) // Should reference back to root
  })
  it('Should handle indirect circular references #2', () => {
    // Create a more complex structure with multiple indirect references
    const root = {
      data: { value: 1 },
      children: [],
      metadata: {},
    } as any

    const child1 = {
      id: 1,
      parent: root,
      siblings: [],
    } as any

    const child2 = {
      id: 2,
      parent: root,
      siblings: [],
    } as any

    // Set up the circular references
    root.children = [child1, child2]
    child1.siblings = [child2]
    child2.siblings = [child1]
    root.metadata.firstChild = child1

    const R = Value.Clone(root)

    // Verify structure integrity
    Assert.IsEqual(R.data.value, 1)
    Assert.IsEqual(R.children.length, 2)
    Assert.IsEqual(R.children[0].id, 1)
    Assert.IsEqual(R.children[1].id, 2)

    // Verify circular references are maintained
    Assert.IsEqual(R.children[0].parent, R)
    Assert.IsEqual(R.children[1].parent, R)
    Assert.IsEqual(R.children[0].siblings[0], R.children[1])
    Assert.IsEqual(R.children[1].siblings[0], R.children[0])
    Assert.IsEqual(R.metadata.firstChild, R.children[0])
  })
  it('Should handle deep indirect circular references', () => {
    // Create a deeply nested structure with circular reference at the end
    const V = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: {},
            },
          },
        },
      },
    } as any

    // Create circular reference from deep level back to root
    V.level1.level2.level3.level4.level5.backToRoot = V
    V.level1.level2.level3.level4.level5.backToLevel2 = V.level1.level2

    const R = Value.Clone(V)

    // Verify the structure and circular references
    Assert.IsEqual(R, V)
  })
})
