import { Type, Static } from '../src/typebox'

// ---------------------------------------------------
//
// TypeScript Static Resolution Tests
//
// We expect to be able to break typescript here. The
// DSL rules should be consistent with TypeScripts.
//
// ---------------------------------------------------

{
  const Literal = Type.Literal('hello')
  const String  = Type.String()
  const Number  = Type.Number()
  const Boolean = Type.Boolean()
  const Array   = Type.Array(Type.Any())
  const Object  = Type.Object({})
  const Union   = Type.Union(Type.String(), Type.Number(), Type.Object({ a: Type.String() }))
  
  ;((x: Static<typeof Literal>) => { })('hello')
  ;((x: Static<typeof String>)  => { })('a string')
  ;((x: Static<typeof Number>)  => { })(10)
  ;((x: Static<typeof Boolean>) => { })(true)
  ;((x: Static<typeof Array>)   => { })([])
  ;((x: Static<typeof Object>)  => { })({})
  ;((x: Static<typeof Union>)   => { })('hello')
  ;((x: Static<typeof Union>)   => { })(123)
  ;((x: Static<typeof Union>)   => { })({ a: 'world' })
}
// object
{
  const Object = Type.Object({
    a: Type.String(),
    b: Type.Number(),
    c: Type.Boolean(),
    d: Type.Literal('moon'),
    e: Type.Optional(Type.Number()),
    f: Type.Readonly(Type.String()),
    g: Type.Object({
      x: Type.Number(),
      y: Type.String(),
      z: Type.Optional(Type.Boolean())
    })
  })
  ;((x: Static<typeof Object>)  => { })({
    a: '', 
    b: 1, 
    c: true, 
    d: 'moon',
    // e: 1 // optional
    f: 'alpha',
    g: {
      x: 10,
      y: 'beta',
      // z: false // optional
    }
  })
}

// tagged union descrimination
{
  const Union = Type.Union(
    Type.Object({
      kind: Type.Literal('a'),
      a: Type.String()
    }),
    Type.Object({
      kind: Type.Literal('b'),
      b: Type.Number()
    })
  )
  const method = (union: Static<typeof Union>) => {
    switch(union.kind) {
      case 'a': {
        union.a = 'foo'
        // union.b 
        break;
      }
      case 'b': {
        // union.a 
        union.b = 123
        break;
      }
    }
  }
  method({kind: 'a', a: 'hello'})
  method({kind: 'b', b: 123})

}