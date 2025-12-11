import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

const X = Type.Object({
  x: Type.Number(),
  y: Type.Number()
})

function test(value: Type.Static<typeof X>) {
  
}