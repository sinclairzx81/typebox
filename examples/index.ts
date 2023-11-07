
// Todo: Investigate Union Default (initialize interior types)
// Todo: Implement Value.Clean() Tests - Done

import { Type, Static } from '@sinclair/typebox';

export const A = Type.Object({
    a: Type.ReadonlyOptional(Type.Number()),
    b: Type.Readonly(Type.Number()),
    c: Type.Optional(Type.Number()),
    d: Type.Number()
})
const B = Type.Required(A)
const C = Type.Partial(A)

type A = Static<typeof A>
type B = Static<typeof B>
type C = Static<typeof C>