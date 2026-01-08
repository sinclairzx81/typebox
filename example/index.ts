import Compile from 'typebox/compile'
import System from 'typebox/system'
import Guard from 'typebox/guard'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import { Type, TemplateLiteralDecode, RecordKey } from 'typebox'

// ------------------------------------------------------------------
// Settings
// ------------------------------------------------------------------

System.Settings.Set({ enumerableKind: false })

const A = Type.TemplateLiteral('x-${string}')
const B = TemplateLiteralDecode("^x-.*$")
const R = Type.Record(Type.String(), Type.String())
const X = RecordKey(R)

console.log(R)

