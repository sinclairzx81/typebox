import { Type } from 'typebox'
import { Ok } from './_validate.ts'
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
