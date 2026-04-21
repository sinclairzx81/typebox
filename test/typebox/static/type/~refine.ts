import Type, { type Static } from 'typebox'
import { Assert } from 'test'

{
  const T = Type.Refine(Type.String(), (value) => value === 'hello')
  Assert.IsExtendsMutual<Static<typeof T>, string>(true)
}
