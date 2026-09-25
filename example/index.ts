import Codegen from 'typebox/codegen'
import Compile from 'typebox/compile'
import System from 'typebox/system'
import Guard from 'typebox/guard'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

const T = Type.Object({
  x: Type.Number(),
  y: Type.String({ format: 'email' }),
  w: Type.Array(Type.String(), { uniqueItems: true })
})

Deno.writeTextFileSync(new URL('./vector.ts', import.meta.url), Codegen.TypeScript(T))
Deno.writeTextFileSync(new URL('./vector.js', import.meta.url), Codegen.JavaScript(T))