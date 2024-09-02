import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Constructor', () => {
  it('Should create value', () => {
    const T = Type.Constructor(
      [],
      Type.Object({
        test: Type.Function([], Type.Number({ default: 123 })),
      }),
    )
    const C = Value.Create(T)
    const I = new C()
    const R = I.test()
    Assert.IsEqual(R, 123)
  })
  it('Should create default', () => {
    const T = Type.Constructor(
      [],
      Type.Object({
        test: Type.Function([], Type.Number({ default: 123 })),
      }),
      {
        default: () =>
          class {
            test() {
              return 321
            }
          },
      },
    )
    const C = Value.Create(T)
    const I = new C()
    const R = I.test()
    Assert.IsEqual(R, 321)
  })
})
