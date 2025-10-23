import { Assert } from 'test'
import Schema from 'typebox/schema'

const Test = Assert.Context('Schema.Pointer')

Test('Should Indices 1', () => {
  const R = [...Schema.Pointer.Indices('')]
  Assert.IsEqual(R, [])
})
Test('Should Indices 2', () => {
  const R = [...Schema.Pointer.Indices('a')]
  Assert.IsEqual(R, ['a'])
})
Test('Should Indices 3', () => {
  const R = [...Schema.Pointer.Indices('/')]
  Assert.IsEqual(R, [''])
})
Test('Should Indices 4', () => {
  const R = [...Schema.Pointer.Indices('/x')]
  Assert.IsEqual(R, ['x'])
})
Test('Should Indices 5', () => {
  const R = [...Schema.Pointer.Indices('/x/')]
  Assert.IsEqual(R, ['x', ''])
})
Test('Should Indices 6', () => {
  const R = [...Schema.Pointer.Indices('/x//')]
  Assert.IsEqual(R, ['x', '', ''])
})
Test('Should Indices 7', () => {
  const R = [...Schema.Pointer.Indices('/x//y')]
  Assert.IsEqual(R, ['x', '', 'y'])
})
Test('Should Indices 8', () => {
  const R = [...Schema.Pointer.Indices('/x//y/')]
  Assert.IsEqual(R, ['x', '', 'y', ''])
})
Test('Should Indices 9', () => {
  const R = [...Schema.Pointer.Indices('/x/~0')]
  Assert.IsEqual(R, ['x', '~'])
})
Test('Should Indices 10', () => {
  const R = [...Schema.Pointer.Indices('/x/~1')]
  Assert.IsEqual(R, ['x', '/'])
})
Test('Should Indices 11', () => {
  const R = [...Schema.Pointer.Indices('/x/~0/')]
  Assert.IsEqual(R, ['x', '~', ''])
})
Test('Should Indices 12', () => {
  const R = [...Schema.Pointer.Indices('/x/~1/')]
  Assert.IsEqual(R, ['x', '/', ''])
})
Test('Should Indices 13', () => {
  const R = [...Schema.Pointer.Indices('/x/a~0b')]
  Assert.IsEqual(R, ['x', 'a~b'])
})
Test('Should Indices 14', () => {
  const R = [...Schema.Pointer.Indices('/x/a~1b')]
  Assert.IsEqual(R, ['x', 'a/b'])
})
Test('Should Indices 15', () => {
  const R = [...Schema.Pointer.Indices('/x/a~0b/')]
  Assert.IsEqual(R, ['x', 'a~b', ''])
})
Test('Should Indices 16', () => {
  const R = [...Schema.Pointer.Indices('/x/a~1b/')]
  Assert.IsEqual(R, ['x', 'a/b', ''])
})
Test('Should Indices 17', () => {
  const R = [...Schema.Pointer.Indices('/x/a~0b///y')]
  Assert.IsEqual(R, ['x', 'a~b', '', '', 'y'])
})
Test('Should Indices 18', () => {
  const R = [...Schema.Pointer.Indices('/x/a~1b///y')]
  Assert.IsEqual(R, ['x', 'a/b', '', '', 'y'])
})
Test('Should Indices 19', () => {
  const R = [...Schema.Pointer.Indices('/x/a~0b///')]
  Assert.IsEqual(R, ['x', 'a~b', '', '', ''])
})
Test('Should Indices 20', () => {
  const R = [...Schema.Pointer.Indices('/x/a~1b///')]
  Assert.IsEqual(R, ['x', 'a/b', '', '', ''])
})
//-----------------------------------------------
// Get
//-----------------------------------------------
Test('Should Get 1', () => {
  const V = [0, 1, 2, 3]
  Assert.IsEqual(Schema.Pointer.Get(V, ''), [0, 1, 2, 3])
  Assert.IsEqual(Schema.Pointer.Get(V, '/'), undefined)
  Assert.IsEqual(Schema.Pointer.Get(V, '/0'), 0)
  Assert.IsEqual(Schema.Pointer.Get(V, '/1'), 1)
  Assert.IsEqual(Schema.Pointer.Get(V, '/2'), 2)
  Assert.IsEqual(Schema.Pointer.Get(V, '/3'), 3)
})
Test('Should Get 2', () => {
  const V = [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }]
  Assert.IsEqual(Schema.Pointer.Get(V, ''), [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }])
  Assert.IsEqual(Schema.Pointer.Get(V, '/'), undefined)
  Assert.IsEqual(Schema.Pointer.Get(V, '/0'), { x: 0 })
  Assert.IsEqual(Schema.Pointer.Get(V, '/1'), { x: 1 })
  Assert.IsEqual(Schema.Pointer.Get(V, '/2'), { x: 2 })
  Assert.IsEqual(Schema.Pointer.Get(V, '/3'), { x: 3 })
  Assert.IsEqual(Schema.Pointer.Get(V, '/0/x'), 0)
  Assert.IsEqual(Schema.Pointer.Get(V, '/1/x'), 1)
  Assert.IsEqual(Schema.Pointer.Get(V, '/2/x'), 2)
  Assert.IsEqual(Schema.Pointer.Get(V, '/3/x'), 3)
})
//-----------------------------------------------
// Delete
//-----------------------------------------------
Test('Should Delete 1', () => {
  const V = { x: {} }
  const R = Schema.Pointer.Delete(V, '/x/x')
  Assert.IsEqual(R, { x: {} })
})
Test('Should Delete 2', () => {
  const V = { x: { x: 1 } }
  const R = Schema.Pointer.Delete(V, '/x/x')
  Assert.IsEqual(R, { x: {} })
})
Test('Should Delete 3', () => {
  const V = [1, 2, 3]
  const R = Schema.Pointer.Delete(V, '/1')
  Assert.IsEqual(R, [1, 3])
})
Test('Should Delete 3', () => {
  const V = [1, 2, 3]
  const R = Schema.Pointer.Delete(V, '/100')
  Assert.IsEqual(R, [1, 2, 3])
})
//-----------------------------------------------
// Has
//-----------------------------------------------
Test('Should Has 1', () => {
  const V: any = undefined
  Assert.IsEqual(Schema.Pointer.Has(V, ''), true)
})
Test('Should Has 2', () => {
  const V: any = null
  Assert.IsEqual(Schema.Pointer.Has(V, ''), true)
})
Test('Should Has 3', () => {
  const V = {}
  Assert.IsEqual(Schema.Pointer.Has(V, ''), true)
})
Test('Should Has 4', () => {
  const V = { x: { y: { z: 1 } } }
  Assert.IsEqual(Schema.Pointer.Has(V, '/x/y/z'), true)
})
Test('Should Has 5', () => {
  const V = { x: { y: {} } }
  Assert.IsEqual(Schema.Pointer.Has(V, '/x/y/z'), false)
})
//-----------------------------------------------
// Throw
//-----------------------------------------------
Test('Should throw 1', () => {
  const V = {}
  Assert.Throws(() => Schema.Pointer.Set(V, '', { x: 1 }))
})
Test('Should throw 2', () => {
  const V = {}
  Assert.Throws(() => Schema.Pointer.Delete(V, ''))
})
Test('Should throw 3', () => {
  const V = { x: 1 }
  Assert.Throws(() => Schema.Pointer.Set(V, '/x/y', 3))
})
//-----------------------------------------------
// Escapes
//-----------------------------------------------
Test('Should support get ~0 Schema.Pointer escape', () => {
  const V = {
    x: { '~': { x: 1 } }
  }
  Assert.IsEqual(Schema.Pointer.Get(V, '/x/~0'), { x: 1 })
})

Test('Should support get ~1 Schema.Pointer escape', () => {
  const V = {
    x: { '/': { x: 1 } }
  }
  Assert.IsEqual(Schema.Pointer.Get(V, '/x/~1'), { x: 1 })
})
