import { Type } from '@sinclair/typebox'
import {ajv, fail, ok} from "./validate";

describe('Ref', () => {
  it('Ref',  () => {
    const T = Type.Object({
      a: Type.Number(),
      b: Type.String(),
      c: Type.Boolean(),
      d: Type.Array(Type.Number()),
      e: Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    }, {
      $id: 'referenced-object'
    })
    const R = Type.Ref(T)

    ajv.addSchema(T)

    ok(R, {
      a: 10,
      b: '',
      c: true,
      d: [1, 2, 3],
      e: {
        x: 10,
        y: 20
      }
    })

    fail(R, {})
    fail(R, [])
    fail(R, 'hello')
    fail(R, true)
    fail(R, 123)
    fail(R, null)
  })
})
