import { type Static, Type } from 'typebox'
import { Assert } from 'test'

{
	const T = Type.Convert(Type.String(), (value) => ({ action: 'continue', value: null }))
	type T = Static<typeof T>

	Assert.IsExtendsMutual<T, string>(true)
	Assert.IsExtendsMutual<T, null>(false)
}

{
	const T = Type.Convert(Type.String(), (value) => ({ action: 'final', value: null }))
	type T = Static<typeof T>

	Assert.IsExtendsMutual<T, string>(true)
	Assert.IsExtendsMutual<T, null>(false)
}

{
	const T = Type.Convert(Type.String(), (value, type) => {
		Assert.IsExtendsMutual<typeof type, typeof T>(true)
		return { action: 'continue', value: value }
	})
}
