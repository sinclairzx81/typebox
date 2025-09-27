import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Convert')

Test('Should Convert 1', () => {
	const T = Type.Convert(Type.String(), (value) => ({ action: "final", value }))
	const R = Value.Convert(T, 3.14)
	Assert.IsEqual(R, 3.14);
})

Test('Should Convert 2', () => {
	const T = Type.Convert(Type.String(), (value) => ({ action: "continue", value }))
	const R = Value.Convert(T, 3.14)
	Assert.IsEqual(R, "3.14");
})

Test('Should Convert 3', () => {
	const T = Type.Convert(Type.String(), function addOne(value) { return  ({ action: "continue", value: Number(value) + 1 }) })
	const U = Type.Convert(T, function multiplyTen(value) { return  ({ action: "continue", value: Number(value) * 10 }) })
	const R = Value.Convert(U, 10)
	Assert.IsEqual(R, "101")
})
