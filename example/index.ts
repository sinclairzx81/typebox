import { Type, Kind } from '@sinclair/typebox'

const T = Type.Unsafe<string>({ [Kind]: 'Custom' })

console.log(T)





