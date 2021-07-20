import { Type, Static } from '@sinclair/typebox'

const Record = Type.Record(Type.String(), Type.String())

type Record = Static<typeof Record>
