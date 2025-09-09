import { Assert } from 'test'
import Value from 'typebox/value'
import Type from 'typebox'

const Test = Assert.Context('Value.Parse')

Test('Should Parse 0 (Additional)', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  })
  const input = { x: 1, y: 2, z: 3 }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  Assert.HasPropertyKey(output, 'z')
})

Test('Should Parse 1 (No Additional)', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }, { additionalProperties: false })
  const input = { x: 1, y: 2, z: 3 }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  Assert.NotHasPropertyKey(output, 'z')
})
Test('Should Parse 2 (Default)', () => {
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = {}
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
})
Test('Should Parse 3 (Default)', () => {
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = { x: 3, y: 4 }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 3)
  Assert.IsEqual(output.y, 4)
})
Test('Should Parse 4 (Convert)', () => {
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = { x: '3', y: '4' }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 3)
  Assert.IsEqual(output.y, 4)
})
Test('Should Parse 5 (Assert)', () => {
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = undefined
  Assert.Throws(() => Value.Parse(T, input))
})
