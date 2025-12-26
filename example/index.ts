import Compile from 'typebox/compile'
import System from 'typebox/system'
import Guard from 'typebox/guard'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

const A = Type.Record(Type.TemplateLiteral('A${0|1}${0|1}${0|1}${0|1}'), Type.Null())

const B = Type.Index(A, Type.KeyOf(A))





