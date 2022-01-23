import { ValuePointer } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/pointer/Pointer', () => {
  //-----------------------------------------------
  // Format
  //-----------------------------------------------

  it('Should produce correct format #1', () => {
    const R = [...ValuePointer.Format('')]
    Assert.deepEqual(R, [])
  })

  it('Should produce correct format #2', () => {
    const R = [...ValuePointer.Format('a')]
    Assert.deepEqual(R, ['a'])
  })

  it('Should produce correct format #3', () => {
    const R = [...ValuePointer.Format('/')]
    Assert.deepEqual(R, [''])
  })

  it('Should produce correct format #4', () => {
    const R = [...ValuePointer.Format('/x')]
    Assert.deepEqual(R, ['x'])
  })

  it('Should produce correct format #5', () => {
    const R = [...ValuePointer.Format('/x/')]
    Assert.deepEqual(R, ['x', ''])
  })

  it('Should produce correct format #6', () => {
    const R = [...ValuePointer.Format('/x//')]
    Assert.deepEqual(R, ['x', '', ''])
  })

  it('Should produce correct format #7', () => {
    const R = [...ValuePointer.Format('/x//y')]
    Assert.deepEqual(R, ['x', '', 'y'])
  })

  it('Should produce correct format #8', () => {
    const R = [...ValuePointer.Format('/x//y/')]
    Assert.deepEqual(R, ['x', '', 'y', ''])
  })

  it('Should produce correct format #9', () => {
    const R = [...ValuePointer.Format('/x/~0')]
    Assert.deepEqual(R, ['x', '~'])
  })

  it('Should produce correct format #10', () => {
    const R = [...ValuePointer.Format('/x/~1')]
    Assert.deepEqual(R, ['x', '/'])
  })

  it('Should produce correct format #11', () => {
    const R = [...ValuePointer.Format('/x/~0/')]
    Assert.deepEqual(R, ['x', '~', ''])
  })

  it('Should produce correct format #12', () => {
    const R = [...ValuePointer.Format('/x/~1/')]
    Assert.deepEqual(R, ['x', '/', ''])
  })

  it('Should produce correct format #13', () => {
    const R = [...ValuePointer.Format('/x/a~0b')]
    Assert.deepEqual(R, ['x', 'a~b'])
  })

  it('Should produce correct format #14', () => {
    const R = [...ValuePointer.Format('/x/a~1b')]
    Assert.deepEqual(R, ['x', 'a/b'])
  })

  it('Should produce correct format #15', () => {
    const R = [...ValuePointer.Format('/x/a~0b/')]
    Assert.deepEqual(R, ['x', 'a~b', ''])
  })

  it('Should produce correct format #16', () => {
    const R = [...ValuePointer.Format('/x/a~1b/')]
    Assert.deepEqual(R, ['x', 'a/b', ''])
  })

  it('Should produce correct format #17', () => {
    const R = [...ValuePointer.Format('/x/a~0b///y')]
    Assert.deepEqual(R, ['x', 'a~b', '', '', 'y'])
  })

  it('Should produce correct format #18', () => {
    const R = [...ValuePointer.Format('/x/a~1b///y')]
    Assert.deepEqual(R, ['x', 'a/b', '', '', 'y'])
  })

  it('Should produce correct format #19', () => {
    const R = [...ValuePointer.Format('/x/a~0b///')]
    Assert.deepEqual(R, ['x', 'a~b', '', '', ''])
  })

  it('Should produce correct format #20', () => {
    const R = [...ValuePointer.Format('/x/a~1b///')]
    Assert.deepEqual(R, ['x', 'a/b', '', '', ''])
  })

  //-----------------------------------------------
  // Get
  //-----------------------------------------------

  it('Should get array #1', () => {
    const V = [0, 1, 2, 3]
    Assert.deepEqual(ValuePointer.Get(V, ''), [0, 1, 2, 3])
    Assert.deepEqual(ValuePointer.Get(V, '/'), undefined)
    Assert.deepEqual(ValuePointer.Get(V, '/0'), 0)
    Assert.deepEqual(ValuePointer.Get(V, '/1'), 1)
    Assert.deepEqual(ValuePointer.Get(V, '/2'), 2)
    Assert.deepEqual(ValuePointer.Get(V, '/3'), 3)
  })

  it('Should get array #2', () => {
    const V = [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }]
    Assert.deepEqual(ValuePointer.Get(V, ''), [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }])
    Assert.deepEqual(ValuePointer.Get(V, '/'), undefined)
    Assert.deepEqual(ValuePointer.Get(V, '/0'), { x: 0 })
    Assert.deepEqual(ValuePointer.Get(V, '/1'), { x: 1 })
    Assert.deepEqual(ValuePointer.Get(V, '/2'), { x: 2 })
    Assert.deepEqual(ValuePointer.Get(V, '/3'), { x: 3 })
    Assert.deepEqual(ValuePointer.Get(V, '/0/x'), 0)
    Assert.deepEqual(ValuePointer.Get(V, '/1/x'), 1)
    Assert.deepEqual(ValuePointer.Get(V, '/2/x'), 2)
    Assert.deepEqual(ValuePointer.Get(V, '/3/x'), 3)
  })

  it('Should get object #1', () => {
    const V = { x: 0, y: 1, z: 2 }
    Assert.deepEqual(ValuePointer.Get(V, ''), { x: 0, y: 1, z: 2 })
    Assert.deepEqual(ValuePointer.Get(V, '/'), undefined)
    Assert.deepEqual(ValuePointer.Get(V, '/x'), 0)
    Assert.deepEqual(ValuePointer.Get(V, '/y'), 1)
    Assert.deepEqual(ValuePointer.Get(V, '/z'), 2)
  })

  it('Should get object #2', () => {
    const V = { x: { x: 0 }, y: { x: 1 }, z: { x: 2 } }
    Assert.deepEqual(ValuePointer.Get(V, ''), { x: { x: 0 }, y: { x: 1 }, z: { x: 2 } })
    Assert.deepEqual(ValuePointer.Get(V, '/'), undefined)
    Assert.deepEqual(ValuePointer.Get(V, '/x'), { x: 0 })
    Assert.deepEqual(ValuePointer.Get(V, '/y'), { x: 1 })
    Assert.deepEqual(ValuePointer.Get(V, '/z'), { x: 2 })
  })

  it('Should get object #3', () => {
    const V = { '': { x: -1 }, x: { '': { x: 1 } }, y: { '': { x: 2 } }, z: { '': { x: 3 } } }
    Assert.deepEqual(ValuePointer.Get(V, ''), { '': { x: -1 }, x: { '': { x: 1 } }, y: { '': { x: 2 } }, z: { '': { x: 3 } } })
    Assert.deepEqual(ValuePointer.Get(V, '/'), { x: -1 })
    Assert.deepEqual(ValuePointer.Get(V, '/x'), { '': { x: 1 } })
    Assert.deepEqual(ValuePointer.Get(V, '/y'), { '': { x: 2 } })
    Assert.deepEqual(ValuePointer.Get(V, '/z'), { '': { x: 3 } })
    Assert.deepEqual(ValuePointer.Get(V, '/x/'), { x: 1 })
    Assert.deepEqual(ValuePointer.Get(V, '/y/'), { x: 2 })
    Assert.deepEqual(ValuePointer.Get(V, '/z/'), { x: 3 })
    Assert.deepEqual(ValuePointer.Get(V, '/x//x'), 1)
    Assert.deepEqual(ValuePointer.Get(V, '/y//x'), 2)
    Assert.deepEqual(ValuePointer.Get(V, '/z//x'), 3)
  })

  //-----------------------------------------------
  // Has
  //-----------------------------------------------

  it('Should return has true for undefined', () => {
    const V = undefined
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
  })

  it('Should return has true for null', () => {
    const V = null
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
  })

  it('Should return has true for object', () => {
    const V = {}
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
  })

  it('Should return has true for array', () => {
    const V: any[] = []
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
  })

  it('Should return has true for string', () => {
    const V = 'hello'
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
  })

  it('Should return has true for number', () => {
    const V = 42
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
  })

  it('Should return has true for boolean', () => {
    const V = false
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
  })

  it('Should return has true for deeply nested', () => {
    const V = {
      '': { x: { y: { z: 1 } } },
      x: 1,
      y: { x: 1 },
      z: [{ x: 1 }, { y: 1 }],
      w: undefined,
      n: null,
    }
    // exists
    Assert.deepEqual(ValuePointer.Has(V, ''), true)
    Assert.deepEqual(ValuePointer.Has(V, '/'), true)
    Assert.deepEqual(ValuePointer.Has(V, '//x'), true)
    Assert.deepEqual(ValuePointer.Has(V, '//x/y'), true)
    Assert.deepEqual(ValuePointer.Has(V, '//x/y/z'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/x'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/y/x'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/z'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/z/0'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/z/0/x'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/z/1'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/z/1/y'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/x'), true)
    Assert.deepEqual(ValuePointer.Has(V, '/n'), true)
  })

  //-----------------------------------------------
  // Set
  //-----------------------------------------------

  it('Should throw when setting root', () => {
    const V = {}
    Assert.throws(() => ValuePointer.Set(V, '', { x: 1 }))
  })

  it('Should set array values', () => {
    const V = [0, 1, 2]
    ValuePointer.Set(V, '/0', 3)
    ValuePointer.Set(V, '/1', 4)
    ValuePointer.Set(V, '/2', 5)
    Assert.deepEqual(V, [3, 4, 5])
  })

  it('Should set object values', () => {
    const V = { x: 0, y: 1, z: 2 }
    ValuePointer.Set(V, '/x', 3)
    ValuePointer.Set(V, '/y', 4)
    ValuePointer.Set(V, '/z', 5)
    Assert.deepEqual(V, { x: 3, y: 4, z: 5 })
  })

  it('Should set object values recursively #1', () => {
    const V = {}
    ValuePointer.Set(V, '/x/y/z', 1)
    Assert.deepEqual(V, { x: { y: { z: 1 } } })
  })

  it('Should set object values recursively #2', () => {
    const V = {}
    ValuePointer.Set(V, '/x/0/y/z/', 1)
    ValuePointer.Set(V, '/x/1/y/z/', 2)
    Assert.deepEqual(V, {
      x: {
        0: {
          y: {
            z: {
              '': 1,
            },
          },
        },
        1: {
          y: {
            z: {
              '': 2,
            },
          },
        },
      },
    })
  })

  //-----------------------------------------------
  // Delete
  //-----------------------------------------------

  it('Should throw when deleting root', () => {
    const V = {}
    Assert.throws(() => ValuePointer.Delete(V, ''))
  })

  it('Should delete object properties', () => {
    const V = {
      x: { x: 1, y: 2, z: 3 },
      y: { x: 3, y: 4, z: 5 },
    }
    ValuePointer.Delete(V, '/x/y')
    ValuePointer.Delete(V, '/y')
    Assert.deepEqual(V, { x: { x: 1, z: 3 } })
  })

  it('Should be a noop if property does not exist', () => {
    const V = {
      x: { x: 1, y: 2, z: 3 },
      y: { x: 3, y: 4, z: 5 },
    }
    ValuePointer.Delete(V, '/x/w')
    ValuePointer.Delete(V, '/w')
    Assert.deepEqual(V, {
      x: { x: 1, y: 2, z: 3 },
      y: { x: 3, y: 4, z: 5 },
    })
  })

  it('Should not delete owner', () => {
    const V = { x: { y: { z: 1 } } }
    ValuePointer.Delete(V, '/x/y/z')
    Assert.deepEqual(V, { x: { y: {} } })
  })

  it('Should delete owner', () => {
    const V = { x: { y: { z: 1 } } }
    ValuePointer.Delete(V, '/x/y')
    Assert.deepEqual(V, { x: {} })
  })

  it('Should not throw if deleting null property', () => {
    const V = { x: { y: null } }
    ValuePointer.Delete(V, '/x/y/z')
    Assert.deepEqual(V, { x: { y: null } })
  })

  //-----------------------------------------------
  // Escapes
  //-----------------------------------------------

  it('Should support get ~0 pointer escape', () => {
    const V = {
      x: { '~': { x: 1 } },
    }
    Assert.deepEqual(ValuePointer.Get(V, '/x/~0'), { x: 1 })
  })

  it('Should support get ~1 pointer escape', () => {
    const V = {
      x: { '/': { x: 1 } },
    }
    Assert.deepEqual(ValuePointer.Get(V, '/x/~1'), { x: 1 })
  })

  it('Should support set ~0 pointer escape', () => {
    const V = {
      x: { '~': { x: 1 } },
    }
    ValuePointer.Set(V, '/x/~0', { x: 2 })
    Assert.deepEqual(V, {
      x: { '~': { x: 2 } },
    })
  })

  it('Should support set ~1 pointer escape', () => {
    const V = {
      x: { '/': { x: 1 } },
    }
    ValuePointer.Set(V, '/x/~1', { x: 2 })
    Assert.deepEqual(V, {
      x: { '/': { x: 2 } },
    })
  })

  it('Should support delete ~0 pointer escape', () => {
    const V = {
      x: { '~': { x: 1 } },
    }
    ValuePointer.Delete(V, '/x/~0')
    Assert.deepEqual(V, {
      x: {},
    })
  })

  it('Should support delete ~1 pointer escape', () => {
    const V = {
      x: { '/': { x: 1 } },
    }
    ValuePointer.Delete(V, '/x/~1')
    Assert.deepEqual(V, {
      x: {},
    })
  })
})
