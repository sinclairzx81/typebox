import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe("Date", () => {
    it('Should not validate number', () => {
        const T = Type.Date()
        fail(T, 1)
    })
    it('Should validate Date', () => {
        const T = Type.Date()
        ok(T, new Date())
    })
    it('Should not validate string', () => {
        const T = Type.Date()
        fail(T, 'hello')
    })
    it('Should not validate boolean', () => {
        const T = Type.Date()
        fail(T, true)
    })
    it('Should not validate array', () => {
        const T = Type.Date()
        fail(T, [1, 2, 3])
    })
    it('Should not validate object', () => {
        const T = Type.Date()
        fail(T, { a: 1, b: 2 })
    })
    it('Should not validate null', () => {
        const T = Type.Date()
        fail(T, null)
    })
    it('Should not validate undefined', () => {
        const T = Type.Date()
        fail(T, undefined)
    })
})

