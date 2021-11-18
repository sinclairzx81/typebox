
import { Type, Static, TSchema } from '@sinclair/typebox';

import * as X from '@sinclair/typebox'

// const T = Type.Array(Type.Number())                  // ok
// const T = Type.Tuple([Type.String(), Type.Number()]) // ok

const T = Type.Object({
     name: Type.Readonly(Type.Number()),
     age:  Type.Optional(Type.Number())
})
const K = Type.Omit(T, ['name'])

type K = Static<typeof K>

type T = Static<typeof T>

function test(value: T) {
    
}

test({ name: 1 })




