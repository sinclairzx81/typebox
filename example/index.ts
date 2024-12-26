import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Parse, StaticParseAsType } from '@sinclair/typebox/syntax'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const A = Type.String({ format: 'ipv4' })

// todo: Investigate idn_email and idn_hostname RFC
