import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

const R = Schema.Resolver.FindPointer({
  type: 'string',
  $anchor: 'test',
  properties: {
    foo: { $id: 'A', x: 'number' }
  }
}, 'properties/foo')

console.log(R)