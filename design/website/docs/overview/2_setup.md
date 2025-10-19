# Setup

The following is general information for setting up TypeBox

## TsConfig (Required)

TypeBox requires the following `tsconfig.json` configuration

```typescript
// file: tsconfig.json
{
  "compilerOptions": {
    "strict": true,              // Required for Type Inference
    "target": "ES2018",          // Minimum ES Target
  }
}
```

## Ajv (Optional)

The following is the recommended setup if using TypeBox with Ajv

```typescript
import Type from 'typebox'

import addFormats from 'ajv-formats'
import Ajv from 'ajv'

const ajv = addFormats(new Ajv({}), [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex'
])

// ...

const check = ajv.compile(Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}))

const R = check({ x: 1, y: 2, z: 3 })               // const R = true

```