import Type, { type Static } from 'typebox'
import Value from 'typebox/value'
import Guard from 'typebox/guard'


const T = Type.Object({
  x: Type.Intersect([
    Type.Number({ errorMessage: 'Expected X Component' }),
  ])
  // y: Type.Number({ errorMessage: 'Expected Y Component' }),
  // z: Type.Number({ errorMessage: 'Expected Z Component' })
})

const E = Value.Errors(T, { x: '0', y: '12', z: '12' })
const M = E.map(error => {
  const schema = Value.Pointer.Get(T, error.schemaPath.slice(1))!
  const message = Guard.HasPropertyKey(schema, 'errorMessage')
    ? schema.errorMessage
    : error.message
  return { ...error, message }
})

console.log(M)
