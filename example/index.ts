import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const Player = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})

const Object = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number(),
  active: Type.Union([Type.String(), Type.Number()])
})

const Game = Type.Object({
  players: Type.Array(Player),
  objects: Type.Array(Object)
})



const game = Value.Create(Game)

const object = Value.Create(Object)
object.active = 1
game.objects.push(object)
game.players.push(Value.Create(Player))

const next = Value.Clone(game)
next.objects[0].active = 'hello'
next.players[0].x = 10

next.players.push(Value.Create(Player))

const edits = Value.Diff(game, next)

// console.log(edits)

const patch = Value.Patch(game, edits)

// console.log(patch)


console.log('deon')

const D = Value.Diff<any>(                          // const D = [
  { x: 1, y: 2, z: 3 },                             //   { type: 'update', path: '/y', value: 4 },
  { y: 4, z: 5, w: 6 }                              //   { type: 'update', path: '/z', value: 5 },
)                                                   //   { type: 'insert', path: '/w', value: 6 },
                                                    // ]

const P = Value.Patch({ x: 1, y: 2, z: 3 }, D)      // const P = { x: 4, z: 5, w: 6 }

console.log(P)