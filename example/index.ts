import { Type, Static, TSchema } from '@sinclair/typebox';


const A = Type.Object({ a: Type.String() })
const B = Type.Object({ b: Type.String() })
const C = Type.Object({ c: Type.String() })
const E = Type.Object({ e: Type.String() })
const F = Type.Object({ f: Type.String() })
const T = Type.Intersect([A, Type.Union([Type.Intersect([B, C]), Type.Intersect([E, F])])])

console.log(JSON.stringify(T, null, 2))

