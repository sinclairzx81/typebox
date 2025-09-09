import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Deep Recursive Structure Test
// ------------------------------------------------------------------
const { Game } = Type.Script(`
  type Game = Option
  type South = { 'you-went-south': Option }
  type North = { 'you-went-north': Option }
  type West = { 'you-went-west': Option }
  type East = { 'you-went-east': Option }
  type End = 1
  type Option = {
    'go-north': North, 
    'go-south': South, 
    'go-west': West, 
    'go-east': East,
    'end': End
  }
`)
function assert(game: Static<typeof Game>) {
  const end =
    game['go-north']['you-went-north']['go-south']['you-went-south']['go-east']['you-went-east']['go-east']['you-went-east']['go-west']['you-went-west']['go-east']['you-went-east']['go-east']['you-went-east']['go-east']['you-went-east'][
      'end'
    ]
  Assert.IsExtends<typeof end, 1>(true)
}
