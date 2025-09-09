import { Assert } from 'test'
import Value from 'typebox/value'

const Test = Assert.Context('Value.Pointer')

Test('Should produce correct format #1', () => {
  const R = [...Value.Pointer.Format('')]
  Assert.IsEqual(R, [])
})
Test('Should produce correct format #2', () => {
  const R = [...Value.Pointer.Format('a')]
  Assert.IsEqual(R, ['a'])
})
Test('Should produce correct format #3', () => {
  const R = [...Value.Pointer.Format('/')]
  Assert.IsEqual(R, [''])
})
Test('Should produce correct format #4', () => {
  const R = [...Value.Pointer.Format('/x')]
  Assert.IsEqual(R, ['x'])
})
Test('Should produce correct format #5', () => {
  const R = [...Value.Pointer.Format('/x/')]
  Assert.IsEqual(R, ['x', ''])
})
Test('Should produce correct format #6', () => {
  const R = [...Value.Pointer.Format('/x//')]
  Assert.IsEqual(R, ['x', '', ''])
})
Test('Should produce correct format #7', () => {
  const R = [...Value.Pointer.Format('/x//y')]
  Assert.IsEqual(R, ['x', '', 'y'])
})
Test('Should produce correct format #8', () => {
  const R = [...Value.Pointer.Format('/x//y/')]
  Assert.IsEqual(R, ['x', '', 'y', ''])
})
Test('Should produce correct format #9', () => {
  const R = [...Value.Pointer.Format('/x/~0')]
  Assert.IsEqual(R, ['x', '~'])
})
Test('Should produce correct format #10', () => {
  const R = [...Value.Pointer.Format('/x/~1')]
  Assert.IsEqual(R, ['x', '/'])
})
Test('Should produce correct format #11', () => {
  const R = [...Value.Pointer.Format('/x/~0/')]
  Assert.IsEqual(R, ['x', '~', ''])
})
Test('Should produce correct format #12', () => {
  const R = [...Value.Pointer.Format('/x/~1/')]
  Assert.IsEqual(R, ['x', '/', ''])
})
Test('Should produce correct format #13', () => {
  const R = [...Value.Pointer.Format('/x/a~0b')]
  Assert.IsEqual(R, ['x', 'a~b'])
})
Test('Should produce correct format #14', () => {
  const R = [...Value.Pointer.Format('/x/a~1b')]
  Assert.IsEqual(R, ['x', 'a/b'])
})
Test('Should produce correct format #15', () => {
  const R = [...Value.Pointer.Format('/x/a~0b/')]
  Assert.IsEqual(R, ['x', 'a~b', ''])
})
Test('Should produce correct format #16', () => {
  const R = [...Value.Pointer.Format('/x/a~1b/')]
  Assert.IsEqual(R, ['x', 'a/b', ''])
})
Test('Should produce correct format #17', () => {
  const R = [...Value.Pointer.Format('/x/a~0b///y')]
  Assert.IsEqual(R, ['x', 'a~b', '', '', 'y'])
})
Test('Should produce correct format #18', () => {
  const R = [...Value.Pointer.Format('/x/a~1b///y')]
  Assert.IsEqual(R, ['x', 'a/b', '', '', 'y'])
})
Test('Should produce correct format #19', () => {
  const R = [...Value.Pointer.Format('/x/a~0b///')]
  Assert.IsEqual(R, ['x', 'a~b', '', '', ''])
})
Test('Should produce correct format #20', () => {
  const R = [...Value.Pointer.Format('/x/a~1b///')]
  Assert.IsEqual(R, ['x', 'a/b', '', '', ''])
})
//-----------------------------------------------
// Get
//-----------------------------------------------
Test('Should get array #1', () => {
  const V = [0, 1, 2, 3]
  Assert.IsEqual(Value.Pointer.Get(V, ''), [0, 1, 2, 3])
  Assert.IsEqual(Value.Pointer.Get(V, '/'), undefined)
  Assert.IsEqual(Value.Pointer.Get(V, '/0'), 0)
  Assert.IsEqual(Value.Pointer.Get(V, '/1'), 1)
  Assert.IsEqual(Value.Pointer.Get(V, '/2'), 2)
  Assert.IsEqual(Value.Pointer.Get(V, '/3'), 3)
})

Test('Should get array #2', () => {
  const V = [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }]
  Assert.IsEqual(Value.Pointer.Get(V, ''), [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }])
  Assert.IsEqual(Value.Pointer.Get(V, '/'), undefined)
  Assert.IsEqual(Value.Pointer.Get(V, '/0'), { x: 0 })
  Assert.IsEqual(Value.Pointer.Get(V, '/1'), { x: 1 })
  Assert.IsEqual(Value.Pointer.Get(V, '/2'), { x: 2 })
  Assert.IsEqual(Value.Pointer.Get(V, '/3'), { x: 3 })
  Assert.IsEqual(Value.Pointer.Get(V, '/0/x'), 0)
  Assert.IsEqual(Value.Pointer.Get(V, '/1/x'), 1)
  Assert.IsEqual(Value.Pointer.Get(V, '/2/x'), 2)
  Assert.IsEqual(Value.Pointer.Get(V, '/3/x'), 3)
})
//-----------------------------------------------
// Delete
//-----------------------------------------------
Test('Should Delete undefined property', () => {
  const V = { x: {} }
  const R = Value.Pointer.Delete(V, '/x/x')
  Assert.IsEqual(R, { x: {} })
})
Test('Should Delete property', () => {
  const V = { x: { x: 1 } }
  const R = Value.Pointer.Delete(V, '/x/x')
  Assert.IsEqual(R, { x: {} })
})
//-----------------------------------------------
// Has
//-----------------------------------------------
Test('Should return has true for undefined', () => {
  const V: any = undefined
  Assert.IsEqual(Value.Pointer.Has(V, ''), true)
})

Test('Should return has true for null', () => {
  const V: any = null
  Assert.IsEqual(Value.Pointer.Has(V, ''), true)
})
Test('Should return has true for object', () => {
  const V = {}
  Assert.IsEqual(Value.Pointer.Has(V, ''), true)
})
Test('Should return true for deep nested property', () => {
  const V = { x: { y: { z: 1 } } }
  Assert.IsEqual(Value.Pointer.Has(V, '/x/y/z'), true)
})
Test('Should return false for undefined for deep nested property', () => {
  const V = { x: { y: {} } }
  Assert.IsEqual(Value.Pointer.Has(V, '/x/y/z'), false)
})
//-----------------------------------------------
// Set
//-----------------------------------------------
Test('Should throw when setting root', () => {
  const V = {}
  Assert.Throws(() => Value.Pointer.Set(V, '', { x: 1 }))
})
//-----------------------------------------------
// Throw
//-----------------------------------------------
Test('Should throw when deleting root', () => {
  const V = {}
  Assert.Throws(() => Value.Pointer.Delete(V, ''))
})
//-----------------------------------------------
// Escapes
//-----------------------------------------------
Test('Should support get ~0 Value.Pointer escape', () => {
  const V = {
    x: { '~': { x: 1 } }
  }
  Assert.IsEqual(Value.Pointer.Get(V, '/x/~0'), { x: 1 })
})

Test('Should support get ~1 Value.Pointer escape', () => {
  const V = {
    x: { '/': { x: 1 } }
  }
  Assert.IsEqual(Value.Pointer.Get(V, '/x/~1'), { x: 1 })
})
