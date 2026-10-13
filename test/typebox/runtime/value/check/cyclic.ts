import { Type } from 'typebox'
import { Fail, Ok } from './~validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Cyclic')

Test('Should Cyclic 1', () => {
  const T = Type.Cyclic({
    A: Type.Literal('hello')
  }, 'A')
  Ok(T, 'hello')
})
Test('Should Cyclic 2', () => {
  const T = Type.Cyclic({
    A: Type.Literal('hello'),
    B: Type.Ref('A'),
    C: Type.Ref('B'),
    D: Type.Ref('C'),
    E: Type.Ref('D')
  }, 'E')
  Ok(T, 'hello')
})
Test('Should Cyclic 3', () => {
  const T = Type.Cyclic({
    A: Type.Object({
      nodes: Type.Array(Type.Ref('A'))
    })
  }, 'A')
  Ok(T, {
    nodes: [
      { nodes: [{ nodes: [{ nodes: [{ nodes: [] }] }] }] },
      { nodes: [{ nodes: [{ nodes: [{ nodes: [] }] }] }] },
      { nodes: [{ nodes: [{ nodes: [{ nodes: [] }] }] }] },
      { nodes: [{ nodes: [{ nodes: [{ nodes: [] }] }] }] }
    ]
  })
})

Test('Should retain nested Cyclic definition scopes', () => {
  const T = Type.Object({
    text: Type.Cyclic({ Value: Type.String() }, 'Value'),
    number: Type.Cyclic({ Value: Type.Number() }, 'Value')
  })
  Ok(T, { text: 'text', number: 42 })
  Fail(T, { text: 42, number: 'text' })
})

Test('Should resolve selected Cyclic definitions before external context', () => {
  const context = { Value: Type.Number() }
  const T = Type.Cyclic({ Value: Type.String() }, 'Value')
  Ok(context, T, 'text')
  Fail(context, T, 42)
})

Test('Should not resolve a missing selected definition from an enclosing Cyclic scope', () => {
  const T = Type.Object({
    outer: Type.Cyclic({ Value: Type.Number() }, 'Value'),
    inner: Type.Cyclic({ Other: Type.String() }, 'Value')
  })
  Fail(T, { outer: 42, inner: 42 })
})

Test('Should retain nonselected external references inside Cyclic definitions', () => {
  const context = { External: Type.Boolean() }
  const T = Type.Cyclic({ Root: Type.Object({ field: Type.Ref('External') }) }, 'Root')
  Ok(context, T, { field: true })
  Fail(context, T, { field: 42 })
})
