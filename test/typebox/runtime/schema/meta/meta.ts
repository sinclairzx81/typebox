import { Assert } from 'test'
import Schema from 'typebox/schema'
const Test = Assert.Context('Schema.Meta')

// ------------------------------------------------------------------
// Parity Check
// ------------------------------------------------------------------
function Parity(schema: Schema.XSchema, value: unknown) {
  const result1 = Schema.Compile(schema).Check(value)
  const result2 = Schema.Check(schema, value)
  const result3 = Schema.Errors(schema, value)[0]
  Assert.IsEqual(result1, result2)
  Assert.IsEqual(result1, result3)
  return result1
}
function Ok(schema: Schema.XSchema, value: unknown) {
  Assert.IsTrue(Parity(schema, value))
}
function Fail(schema: Schema.XSchema, value: unknown) {
  Assert.IsFalse(Parity(schema, value))
}
// ------------------------------------------------------------------
// Draft-03 (required is a boolean assigned to the property)
// ------------------------------------------------------------------
const LegacyVector3 = {
  type: 'object',
  properties: {
    x: { type: 'number', required: true },
    y: { type: 'number', required: true },
    z: { type: 'number', required: true }
  }
}
// ------------------------------------------------------------------
// Draft-04 to 2020-12: Regular Vector Object
// ------------------------------------------------------------------
const Vector3 = {
  type: 'object',
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  },
  required: ['x', 'y', 'z']
}
// ------------------------------------------------------------------
// InvalidVector3
// ------------------------------------------------------------------
const InvalidVector3 = {
  type: 'object',
  properties: {
    x: { type: 1 },
    y: { type: 1 },
    z: { type: 1 }
  }
}
// ------------------------------------------------------------------
// Valid
// ------------------------------------------------------------------
Test('Should Meta Draft-03', () => {
  Ok(Schema.Meta['http://json-schema.org/draft-03/schema#'], LegacyVector3)
})
Test('Should Meta Draft-04', () => {
  Ok(Schema.Meta['http://json-schema.org/draft-04/schema#'], Vector3)
})
Test('Should Meta Draft-06', () => {
  Ok(Schema.Meta['http://json-schema.org/draft-06/schema#'], Vector3)
})
Test('Should Meta Draft-07', () => {
  Ok(Schema.Meta['http://json-schema.org/draft-07/schema#'], Vector3)
})
Test('Should Meta Draft-2019-09', () => {
  Ok(Schema.Meta['https://json-schema.org/draft/2019-09/schema'], Vector3)
})
Test('Should Meta Draft-2020-12', () => {
  Ok(Schema.Meta['https://json-schema.org/draft/2020-12/schema'], Vector3)
})
// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
Test('Should Not Meta Draft-03', () => {
  Fail(Schema.Meta['http://json-schema.org/draft-03/schema#'], InvalidVector3)
})
Test('Should Not Meta Draft-04', () => {
  Fail(Schema.Meta['http://json-schema.org/draft-04/schema#'], InvalidVector3)
})
Test('Should Not Meta Draft-06', () => {
  Fail(Schema.Meta['http://json-schema.org/draft-06/schema#'], InvalidVector3)
})
Test('Should Not Meta Draft-07', () => {
  Fail(Schema.Meta['http://json-schema.org/draft-07/schema#'], InvalidVector3)
})
Test('Should Not Meta Draft-2019-09', () => {
  Fail(Schema.Meta['https://json-schema.org/draft/2019-09/schema'], InvalidVector3)
})
Test('Should Not Meta Draft-2020-12', () => {
  Fail(Schema.Meta['https://json-schema.org/draft/2020-12/schema'], InvalidVector3)
})
