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
//-------------------------------------------------------------------
// Get
//-------------------------------------------------------------------
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
//-------------------------------------------------------------------
// Delete
//-------------------------------------------------------------------
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
//-------------------------------------------------------------------
// Has
//-------------------------------------------------------------------
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
//-------------------------------------------------------------------
// Throw
//-------------------------------------------------------------------
Test('Should Throw 1', () => {
  const V = {}
  Assert.Throws(() => Schema.Pointer.Set(V, '', { x: 1 }))
})
Test('Should Throw 2', () => {
  const V = {}
  Assert.Throws(() => Schema.Pointer.Delete(V, ''))
})
Test('Should Throw 3', () => {
  const V = { x: 1 }
  Assert.Throws(() => Schema.Pointer.Set(V, '/x/y', 3))
})
//-------------------------------------------------------------------
// Escapes
//-------------------------------------------------------------------
Test('Should Escape 1', () => {
  const V = {
    x: { '~': { x: 1 } }
  }
  Assert.IsEqual(Schema.Pointer.Get(V, '/x/~0'), { x: 1 })
})
Test('Should Escape 2', () => {
  const V = {
    x: { '/': { x: 1 } }
  }
  Assert.IsEqual(Schema.Pointer.Get(V, '/x/~1'), { x: 1 })
})
//-------------------------------------------------------------------
// Unsafe Property Keys
//-------------------------------------------------------------------
Test('Should UnsafeProperty 1', () => {
  Assert.IsEqual(Schema.Pointer.Get({}, '/__proto__'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({}, '/constructor'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({}, '/prototype'), undefined)
})
Test('Should UnsafeProperty 2', () => {
  Assert.IsEqual(Schema.Pointer.Get({ a: {} }, '/a/__proto__'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({ a: {} }, '/a/constructor'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({ a: {} }, '/a/prototype'), undefined)
})
Test('Should UnsafeProperty 3', () => {
  Assert.IsEqual(Schema.Pointer.Has({}, '/__proto__'), false)
  Assert.IsEqual(Schema.Pointer.Has({}, '/constructor'), false)
  Assert.IsEqual(Schema.Pointer.Has({}, '/prototype'), false)
})
Test('Should UnsafeProperty 4', () => {
  Assert.IsEqual(Schema.Pointer.Has({ a: {} }, '/a/__proto__'), false)
  Assert.IsEqual(Schema.Pointer.Has({ a: {} }, '/a/constructor'), false)
  Assert.IsEqual(Schema.Pointer.Has({ a: {} }, '/a/prototype'), false)
})
Test('Should UnsafeProperty 5', () => {
  Assert.Throws(() => Schema.Pointer.Set({}, '/__proto__', 1))
  Assert.Throws(() => Schema.Pointer.Set({}, '/constructor', 1))
  Assert.Throws(() => Schema.Pointer.Set({}, '/prototype', 1))
})
Test('Should UnsafeProperty 6', () => {
  Assert.Throws(() => Schema.Pointer.Set({ a: {} }, '/a/__proto__', 1))
  Assert.Throws(() => Schema.Pointer.Set({ a: {} }, '/a/constructor', 1))
  Assert.Throws(() => Schema.Pointer.Set({ a: {} }, '/a/prototype', 1))
})
Test('Should UnsafeProperty 7', () => {
  Assert.Throws(() => Schema.Pointer.Delete({}, '/__proto__'))
  Assert.Throws(() => Schema.Pointer.Delete({}, '/constructor'))
  Assert.Throws(() => Schema.Pointer.Delete({}, '/prototype'))
})
Test('Should UnsafeProperty 8', () => {
  Assert.Throws(() => Schema.Pointer.Delete({ a: {} }, '/a/__proto__'))
  Assert.Throws(() => Schema.Pointer.Delete({ a: {} }, '/a/constructor'))
  Assert.Throws(() => Schema.Pointer.Delete({ a: {} }, '/a/prototype'))
})
Test('Should UnsafeProperty 9', () => {
  Assert.IsEqual(Schema.Pointer.Get({ my_constructor: 1 }, '/my_constructor'), 1)
  Assert.IsEqual(Schema.Pointer.Get({ prototypes: 1 }, '/prototypes'), 1)
  Assert.IsEqual(Schema.Pointer.Get({ not__proto__: 1 }, '/not__proto__'), 1)
})
//-------------------------------------------------------------------
// Unsafe Property Keys (additional coverage)
//-------------------------------------------------------------------
Test('Should UnsafeProperty 10', () => {
  Assert.IsEqual(Schema.Pointer.Get({}, '/__proto__/a'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({}, '/constructor/a'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({}, '/prototype/a'), undefined)
})
Test('Should UnsafeProperty 11', () => {
  Assert.IsEqual(Schema.Pointer.Has({}, '/__proto__/a'), false)
  Assert.IsEqual(Schema.Pointer.Has({}, '/constructor/a'), false)
  Assert.IsEqual(Schema.Pointer.Has({}, '/prototype/a'), false)
})
Test('Should UnsafeProperty 12', () => {
  Assert.Throws(() => Schema.Pointer.Set({}, '/__proto__/a', 1))
  Assert.Throws(() => Schema.Pointer.Set({}, '/constructor/a', 1))
  Assert.Throws(() => Schema.Pointer.Set({}, '/prototype/a', 1))
})
Test('Should UnsafeProperty 13', () => {
  Assert.Throws(() => Schema.Pointer.Delete({}, '/__proto__/a'))
  Assert.Throws(() => Schema.Pointer.Delete({}, '/constructor/a'))
  Assert.Throws(() => Schema.Pointer.Delete({}, '/prototype/a'))
})

Test('Should UnsafeProperty 14', () => {
  Assert.Throws(() => Schema.Pointer.Set({ a: { b: { c: {} } } }, '/a/b/c/__proto__', 1))
  Assert.Throws(() => Schema.Pointer.Set({ a: { b: { c: {} } } }, '/a/b/c/constructor', 1))
  Assert.Throws(() => Schema.Pointer.Set({ a: { b: { c: {} } } }, '/a/b/c/prototype', 1))
})
Test('Should UnsafeProperty 15', () => {
  Assert.Throws(() => Schema.Pointer.Set({}, '/a/__proto__/b/c', 1))
  Assert.Throws(() => Schema.Pointer.Set({}, '/a/b/constructor/c', 1))
  Assert.Throws(() => Schema.Pointer.Set({}, '/a/b/c/prototype', 1))
})
Test('Should UnsafeProperty 16', () => {
  const V = { '~': { '/': 1 }, '__proto~__': 2, 'constr~uctor': 3, 'protot/ype': 4 }
  Assert.IsEqual(Schema.Pointer.Get(V, '/~0/~1'), 1)
  Assert.IsEqual(Schema.Pointer.Get(V, '/__proto~0__'), 2)
  Assert.IsEqual(Schema.Pointer.Get(V, '/constr~0uctor'), 3)
  Assert.IsEqual(Schema.Pointer.Get(V, '/protot~1ype'), 4)
  Assert.Throws(() => Schema.Pointer.Set({}, '/__proto__', 1))
})
Test('Should UnsafeProperty 17', () => {
  Assert.IsEqual(Schema.Pointer.Get({}, '/__proto__'), undefined)
  Assert.IsEqual(Schema.Pointer.Has({}, '/constructor'), false)
})

Test('Should UnsafeProperty 18', () => {
  Assert.Throws(() => Schema.Pointer.Set({ a: [1, 2, 3] }, '/a/__proto__', 1))
  Assert.Throws(() => Schema.Pointer.Set({ a: [1, 2, 3] }, '/a/constructor', 1))
  Assert.Throws(() => Schema.Pointer.Set({ a: [1, 2, 3] }, '/a/prototype', 1))
})

Test('Should UnsafeProperty 19', () => {
  Assert.IsEqual(Schema.Pointer.Get({ a: { b: 1 } }, '/a/b/__proto__'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({ a: { b: 1 } }, '/a/b/constructor'), undefined)
  Assert.IsEqual(Schema.Pointer.Get({ a: { b: 1 } }, '/a/b/prototype'), undefined)
})

Test('Should UnsafeProperty 20', () => {
  Assert.IsEqual(Schema.Pointer.Get({ proto: 1 }, '/proto'), 1)
  Assert.IsEqual(Schema.Pointer.Get({ construct: 1 }, '/construct'), 1)
  Assert.IsEqual(Schema.Pointer.Get({ __proto__constructor: 1 }, '/__proto__constructor'), 1)
})

Test('Should UnsafeProperty 21', () => {
  Assert.IsEqual(Schema.Pointer.Get({ constructors: { a: 1 } }, '/constructors/a'), 1)
  Assert.IsEqual(Schema.Pointer.Set({ constructors: { a: 1 } }, '/constructors/a', 2), { constructors: { a: 2 } })
})
