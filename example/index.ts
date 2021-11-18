import { Type, Static, TSchema } from '@sinclair/typebox';

const T = Type.String()

type T = Static<typeof T>
