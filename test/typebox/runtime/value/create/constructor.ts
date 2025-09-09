import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Constructor')

Test('Should Create 1', () => {
  const T = Type.Constructor(
    [],
    Type.Object({
      test: Type.Function([], Type.Number({ default: 123 }))
    })
  )
  const C = Value.Create(T)
  const I = new C()
  const R = I.test()
  Assert.IsEqual(R, 123)
})

Test('Should Create 2', () => {
  const T = Type.Constructor(
    [],
    Type.Object({
      test: Type.Function([], Type.Number({ default: 123 }))
    }),
    {
      default: () =>
        class {
          test() {
            return 321
          }
        }
    }
  )
  const C = Value.Create(T)
  const I = new C()
  const R = I.test()
  Assert.IsEqual(R, 321)
})
