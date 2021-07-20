import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Record', () => {
	it('Should validate when all property values are numbers', () => {
		const T = Type.Record(Type.String(), Type.Number())
		ok(T, { 'a': 1, 'b': 2, 'c': 3 })
	})

	it('Should validate when all property keys are strings', () => {
		const T = Type.Record(Type.String(), Type.Number())
		ok(T, { 'a': 1, 'b': 2, 'c': 3, '0': 4 })
	})

	it('Should validate when all property keys are numbers', () => {
		const T = Type.Record(Type.Number(), Type.Number())
		ok(T, { '0': 1, '1': 2, '2': 3, '3': 4 })
	})

	it('Should validate when all property keys are numbers, but one property is a string with varying type', () => {
		const T = Type.Record(Type.Number(), Type.Number())
		ok(T, { '0': 1, '1': 2, '2': 3, '3': 4, 'a': 'hello' })
	})

	it('Should not validate when all property keys are numbers, but one property is a string with varying type with additionalProperties false', () => {
		const T = Type.Record(Type.Number(), Type.Number(), { additionalProperties: false })
		fail(T, { '0': 1, '1': 2, '2': 3, '3': 4, 'a': 'hello' })
	})

	it('Should validate when specifying union literals for the known keys', () => {
		const K = Type.Union([
			Type.Literal('a'),
			Type.Literal('b'),
			Type.Literal('c'),
		])
		const T = Type.Record(K, Type.Number())
		ok(T, { a: 1, b: 2, c: 3, d: 'hello' })
	})

	it('Should not validate when specifying union literals for the known keys and with additionalProperties: false', () => {
		const K = Type.Union([
			Type.Literal('a'),
			Type.Literal('b'),
			Type.Literal('c'),
		])
		const T = Type.Record(K, Type.Number(), { additionalProperties: false })
		
		fail(T, { a: 1, b: 2, c: 3, d: 'hello' })
	})
})
