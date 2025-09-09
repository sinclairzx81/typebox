import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Assert')

Test('Should Assert 1', () => {
  Value.Assert(Type.String(), 'hello')
})
Test('Should Assert 2', () => {
  Value.Assert({}, Type.String(), 'hello')
})
Test('Should Assert 3', () => {
  Assert.Throws(() => Value.Assert(Type.String(), null))
})
Test('Should Assert 4', () => {
  Assert.Throws(() => Value.Assert(Type.Ref('T'), 'hello'))
})
