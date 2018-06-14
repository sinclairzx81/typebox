import { Type, Static } from "../src/typebox"

// ---------------------------------------------------
// TypeScript Static Resolution Tests
// ---------------------------------------------------

{
  const String  = Type.String()
  const Number  = Type.Number()
  const Boolean = Type.Boolean()
  const Array   = Type.Array()
  const Object  = Type.Object()
  
  ;((x: Static<typeof String>)  => { })("a string")
  ;((x: Static<typeof Number>)  => { })(10)
  ;((x: Static<typeof Boolean>) => { })(true)
  ;((x: Static<typeof Array>)   => { })([])
  ;((x: Static<typeof Object>)  => { })({})
}
// complex
{
  const Object = Type.Object({
    a: Type.String(),
    b: Type.Number(),
    c: Type.Boolean()
  })
  ;((x: Static<typeof Object>)  => { })({a: "", b: 1, c: true})
}
// complex + optional
{
  const Object = Type.Object({
    a: Type.String(),
    b: Type.Number(),
    c: Type.Optional(Type.Boolean())
  })
  ;((xssss: Static<typeof Object>)  => { })({a: "", b: 1, c: undefined })
}
