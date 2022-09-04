import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const Player = Type.Object({
  id: Type.String(),
  x: Type.Number(),
  y: Type.Number()
})


const Game = Type.Object({
  players: Type.Array(Player)
})


// initial game state
const gamestate1 = Value.Create(Game)

// next game state
const gamestate2 = Value.Clone(gamestate1)
gamestate2.players.push({...Value.Create(Player), id: '1' })
gamestate2.players.push({...Value.Create(Player), id: '2' })

// compute delta and send across network

const delta = Value.Diff(gamestate1, gamestate2)

// apply delta to remote gamestate

const gamestate3 = Value.Patch(gamestate1, delta)

// expect equal

const equal = Value.Equal(gamestate2, gamestate3)

console.log(equal)