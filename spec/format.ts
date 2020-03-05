import { Type } from '../src/typebox'
import { ok, fail } from './validate'

describe('Format', () => {

    it('date-time', () => {
        const T = Type.Format('date-time')
        ok(T, "2018-11-13T20:20:39+00:00")
        fail(T, "2018-11-13")
        fail(T, "20:20:39+00:00")
        fail(T, "string")
    })

    it('email', () => {
        const T = Type.Format('email')
        ok(T, "dave@domain.com")
        fail(T, "orange")
    })
})