import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/Constructor', () => {
  it('Should validate constructor 1', () => {
    const T = Type.Constructor([], Type.Object({}))
    Ok(T, class {})
  })
  it('Should validate constructor 2', () => {
    const T = Type.Constructor([Type.Number()], Type.Object({}))
    // note: constructor arguments are non-checkable
    Ok(T, class {})
  })
  it('Should validate constructor 3', () => {
    const T = Type.Constructor(
      [Type.Number()],
      Type.Object({
        method: Type.Function([], Type.Void()),
      }),
    )
    Ok(
      T,
      class {
        method() {}
      },
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
    Ok(
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
    )
  })
  it('Should not validate constructor 1', () => {
    const T = Type.Constructor([Type.Number()], Type.Object({}))
    Fail(T, 1)
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
    Fail(
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
    )
  })
})
