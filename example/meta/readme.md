# Meta Schema Validation

TypeBox validation is designed to support multiple draft versions without restriction, meaning schemas from different JSON Schema versions can be mixed and matched within the same validation flow. This open design differs from other JSON Schema validators, which typically require exclusive adherence to a single specification version.

TypeBox treats schema draft verification as a validation operation unto itself. Because JSON Schema is itself expressed in JSON, a `$schema` meta schema can be used to validate that a given schema conforms to a specific draft version.

### Example

If you need to constrain schematics to a specific version, this directory includes inline meta schemas for each published draft. The following example shows how to assert that a schema conforms to a given draft before validating a value against it.

```typescript
import Schema from 'typebox/schema'
import Meta from './meta/index.ts'

// 1. Load the meta schema
const metaschema = Meta.Draft_2020_12

// 2. Define the schema to validate
const schema = { type: 'string' }

// 3. Validate schema is draft 2020-12, and value is a string
const isValid = Check(metaschema, schema) && Check(schema, 'hello')
```