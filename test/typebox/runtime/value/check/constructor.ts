import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Constructor')

Test('Should validate constructor 1', () => {
  const T = Type.Constructor([], Type.Object({}))
  Ok(T, class {})
})
Test('Should validate constructor 2', () => {
  const T = Type.Constructor([Type.Number()], Type.Object({}))
  // note: constructor arguments are non-checkable
  Ok(T, class {})
})
Test('Should validate constructor 3', () => {
  const T = Type.Constructor(
    [Type.Number()],
    Type.Object({
      method: Type.Function([], Type.Void())
    })
  )
  Ok(
    T,
    class {
      method() {}
    }
  )
})
Test('Should validate constructor 4', () => {
  const T = Type.Constructor(
    [Type.Number()],
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    })
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
    }
  )
})
Test('Should not validate constructor 1', () => {
  const T = Type.Constructor([Type.Number()], Type.Object({}))
  Fail(T, 1)
})
