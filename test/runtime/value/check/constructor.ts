import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Constructor', () => {
  it('Should validate constructor 1', () => {
    const T = Type.Constructor([], Type.Object({}))
    Assert.IsTrue(Value.Check(T, class {}))
  })
  it('Should validate constructor 2', () => {
    const T = Type.Constructor([Type.Number()], Type.Object({}))
    // note: constructor arguments are non-checkable
    Assert.IsTrue(Value.Check(T, class {}))
  })
  it('Should validate constructor 3', () => {
    const T = Type.Constructor(
      [Type.Number()],
      Type.Object({
        method: Type.Function([], Type.Void()),
      }),
    )
    Assert.IsTrue(
      Value.Check(
        T,
        class {
          method() {}
        },
      ),
    )
  })
  it('Should validate constructor 4', () => {
    const T = Type.Constructor(
      [Type.Number()],
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    Assert.IsTrue(
      Value.Check(
        T,
        class {
          get x() {
            return 1
          }
          get y() {
            return 1
          }
          get z() {
            return 1
          }
        },
      ),
    )
  })
  it('Should not validate constructor 1', () => {
    const T = Type.Constructor([Type.Number()], Type.Object({}))
    Assert.IsFalse(Value.Check(T, 1))
  })
  it('Should not validate constructor 2', () => {
    const T = Type.Constructor(
      [Type.Number()],
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    Assert.IsFalse(
      Value.Check(
        T,
        class {
          get x() {
            return null
          }
          get y() {
            return null
          }
          get z() {
            return null
          }
        },
      ),
    )
  })
})
