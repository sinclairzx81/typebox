
import { Type, Static, TSchema } from '@sinclair/typebox';

const T = Type.Union([Type.String(), Type.Null()])

const R = Type.Ref(T)

type T = Static<typeof R>




