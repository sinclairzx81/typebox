import { Assert } from 'test'
import System from 'typebox/system'
import Value from 'typebox/value'
import Type from 'typebox'

const Test = Assert.Context('Value.Parse')

// ------------------------------------------------------------------
// Default Parse
// ----------------------------------------------------------------
Test('Should Parse Context 0', () => {
  const T = Type.Number()
  const output = Value.Parse({ T }, Type.Ref('T'), 1)
  Assert.IsEqual(output, 1)
})
// ------------------------------------------------------------------
// Default Parse
// ------------------------------------------------------------------
Test('Should Parse Default 0', () => {
  const T = Type.Number()
  const output = Value.Parse(T, 1)
  Assert.IsEqual(output, 1)
})
Test('Should Parse Default 1', () => {
  const T = Type.Number()
  Assert.Throws(() => Value.Parse(T, '1'))
})
// ------------------------------------------------------------------
// Corrective Parse
// ------------------------------------------------------------------
Test('Should Parse Corrective 0 (Additional)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  })
  const input = { x: 1, y: 2, z: 3 }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  Assert.HasPropertyKey(output, 'z')
  System.Settings.Reset()
})
Test('Should Parse Corrective 1 (No Additional)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }, { additionalProperties: false })
  const input = { x: 1, y: 2, z: 3 }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  Assert.NotHasPropertyKey(output, 'z')
  System.Settings.Reset()
})
Test('Should Parse Corrective 2 (Default)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = {}
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  System.Settings.Reset()
})
Test('Should Parse Corrective 3 (Default)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = { x: 3, y: 4 }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 3)
  Assert.IsEqual(output.y, 4)
  System.Settings.Reset()
})
Test('Should Parse Corrective 4 (Convert)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = { x: '3', y: '4' }
  const output = Value.Parse(T, input)
  Assert.IsEqual(output.x, 3)
  Assert.IsEqual(output.y, 4)
  System.Settings.Reset()
})
Test('Should Parse Corrective 5 (Assert)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  })
  const input = undefined
  Assert.Throws(() => Value.Parse(T, input))
  System.Settings.Reset()
})
