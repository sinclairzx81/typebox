import { Type, Static } from '@sinclair/typebox';

const A = Type.Object({ a: Type.String() })
const B = Type.Object({ b: Type.String() })
const C = Type.Object({ c: Type.String() })
const T = Type.Intersect([A, Type.Union([B, C])])
type T = Static<typeof T>






