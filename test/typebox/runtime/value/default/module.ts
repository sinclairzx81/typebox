import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Module')

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1526
// ------------------------------------------------------------------
Test('Should Module 1', () => {
  const { Event } = Type.Module({
    base: Type.Object({
      id: Type.Optional(Type.String()),
      blocking: Type.Optional(Type.Boolean({ default: true }))
    }),
    Event: Type.Union([
      Type.Intersect([
        Type.Ref('base'),
        Type.Object({
          type: Type.Literal('audio'),
          src: Type.String()
        })
      ]),
      Type.Intersect([
        Type.Ref('base'),
        Type.Object({
          type: Type.Literal('for'),
          do: Type.Ref('Event')
        })
      ])
    ])
  })
  const Result = Value.Default(Event, { type: 'audio', src: 'test.mp3' })
  Assert.IsEqual(Result, { type: 'audio', src: 'test.mp3', blocking: true })
})
