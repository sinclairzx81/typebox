import { Locale } from 'typebox/system'
import { Assert } from 'test'

const Test = Assert.Context('System.Locale')

Test('Should Set Locale', () => {
  Locale.Set(Locale.ar_001)
})
Test('Should Get Locale', () => {
  Assert.IsTrue(typeof Locale.Get() === 'function')
})
Test('Should Reset Locale', () => {
  Locale.Reset()
  Assert.IsTrue(Locale.Get() === Locale.en_US)
})
