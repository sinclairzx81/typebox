import { Type } from 'typebox'
import { Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Unicode')

// ---------------------------------------------------------
// Properties
// ---------------------------------------------------------
Test('Should support unicode properties', () => {
  const T = Type.Object({
    이름: Type.String()
  })
  Ok(T, {
    이름: 'dave'
  })
})
