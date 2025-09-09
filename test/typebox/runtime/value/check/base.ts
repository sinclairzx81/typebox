import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Base')

class TStringBase extends Type.Base<string> {
  public override Check(value: unknown): value is string {
    return typeof value === 'string'
  }
  public override Errors(value: unknown): object[] {
    return typeof value === 'string' ? [] : [{ message: 'expected string' }]
  }
}
const StringBase = () => new TStringBase()

// ------------------------------------------------------------------
// Direct
// ------------------------------------------------------------------
Test('Should validate Base 1', () => {
  const T: TStringBase = StringBase()
  Ok(T, 'hello')
})
Test('Should validate Base 2', () => {
  const T: TStringBase = StringBase()
  Fail(T, 1)
})
// ------------------------------------------------------------------
// Embedded
// ------------------------------------------------------------------
Test('Should validate Base 2', () => {
  const T = Type.Tuple([StringBase(), StringBase(), StringBase(), StringBase()])
  Ok(T, ['A', 'B', 'C', 'D'])
})
Test('Should validate Base 3', () => {
  const T = Type.Tuple([StringBase(), StringBase(), StringBase(), StringBase()])
  Fail(T, ['A', 'B', 'C', 1])
})
Test('Should validate Base 3', () => {
  const T = Type.Tuple([StringBase(), StringBase(), StringBase(), StringBase()])
  Fail(T, ['A', 'B', 'C'])
})
