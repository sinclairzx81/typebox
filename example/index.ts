import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

const A = Type.Object({
  x: Type.Number(),
  y: Type.String(),
  z: Type.Boolean()
})



