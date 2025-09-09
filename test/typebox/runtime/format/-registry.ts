import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.Registry')

Test('Should Get', () => {
  const R = Format.Get('email')
  Assert.IsTrue(typeof R === 'function')
})

Test('Should Set', () => {
  const C = () => true
  Format.Set('foo', C)
  const R = Format.Get('foo')
  Assert.IsEqual(R, C)
  Format.Reset()
})

Test('Should Has', () => {
  const R = Format.Has('email')
  Assert.IsTrue(R)
})

Test('Should Clear', () => {
  Format.Clear()
  Assert.IsEqual(Format.Entries(), [])
  Format.Reset()
})

Test('Should Clear | Reset', () => {
  Format.Clear()
  const R1 = Format.Has('email')
  Assert.IsFalse(R1)

  Format.Reset()
  const R2 = Format.Has('email')
  Assert.IsTrue(R2)
})
