import { deepStrictEqual, strictEqual } from 'assert'
import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Object', () => {
	it('Should validate with correct property values', () => {
		const T = Type.Object({
			a: Type.Number(),
			b: Type.String(),
			c: Type.Boolean(),
			d: Type.Array(Type.Number()),
			e: Type.Object({ x: Type.Number(), y: Type.Number() })
		})
		ok(T, {
			a: 10,
			b: 'hello',
			c: true,
			d: [1, 2, 3],
			e: { x: 10, y: 20 }
		})
	})
	it('Should not validate with correct property values', () => {
		const T = Type.Object({
			a: Type.Number(),
			b: Type.String(),
			c: Type.Boolean(),
			d: Type.Array(Type.Number()),
			e: Type.Object({ x: Type.Number(), y: Type.Number() })
		})
		fail(T, {
			a: 'not a number', // error
			b: 'hello',
			c: true,
			d: [1, 2, 3],
			e: { x: 10, y: 20 }
		})
	})

	it('Should allow additionalProperties by default', () => {
		const T = Type.Object({
			a: Type.Number(),
			b: Type.String()
		})
		ok(T, {
			a: 1,
			b: 'hello',
			c: true
		})
	})

	it('Should not allow additionalProperties if additionalProperties is false', () => {
		const T = Type.Object({
			a: Type.Number(),
			b: Type.String()
		}, { additionalProperties: false })
		fail(T, {
			a: 1,
			b: 'hello',
			c: true
		})
	})
})
