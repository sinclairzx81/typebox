import { Compile } from 'typebox/compile'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

import Settings from 'typebox/system'

//Settings.Settings.Set({ enumerableKind: true })

class Fail extends Type.Base {
  override Check(value: unknown): value is unknown {
    return false
  }
}

const A = Type.Object({
  x: new Fail()
})

console.log(Value.Errors(A, { x: 1 }))