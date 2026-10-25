# Module.Errors

Module types throw a TypeError on Parse error, but do not include any error information indicating why a value was invalid. Modules are kept intentionally minimal to reduce bundle size while also ensuring the highest possible performance. They defer error generation to dedicated reporting infrastructure, which handles error formatting, localization and other presentational concerns. This section shows how to integrate Module types with TypeBox's Schema.Errors(...) reporter.

## Error

Module types throw the following error on a failed Parse:

```typescript
import { Vector } from './math.ts'

Vector.Parse(null)                           // throw: TypeError {
                                             //   type: 'Vector',
                                             //   value: null
                                             // }
```

## Report

The following shows a Report function that uses TypeBox's Schema submodule to handle error reporting on behalf of the compiled validator. Here, Schema.Errors() serves as a reporting device for the compiled validator.

```typescript
import { Errors, ParseError } from 'typebox/schema'
import { type Validator } from 'typebox/module'
import { Vector } from './math.ts'

// ------------------------------------------------------------------
// Report
// ------------------------------------------------------------------

function Report<Type extends Validator>(type: Type, value: unknown): ReturnType<Type['Parse']> {
  // 1. Return the value if it is valid.
  if (type.Check(value)) return value as never
  // 2. Call Errors(...) to gather diagnostics.
  const [_, errors] = Errors(type.Context(), type.Schema(), value)
  // 3. Throw the error.
  throw new ParseError(type.Context(), type.Schema(), value, errors)
}

// ------------------------------------------------------------------
// Usage
// ------------------------------------------------------------------

const result = Report(Vector, { x: null })   // Throws a ParseError {
                                             //   context: {},
                                             //   schema: {
                                             //     type: 'object',
                                             //     required: [ 'x', 'y', 'z' ],
                                             //     properties: {
                                             //       x: { type: 'number' },
                                             //       y: { type: 'number' },
                                             //       z: { type: 'number' }
                                             //     }
                                             //   },
                                             //   value: { x: null },
                                             //   errors: [
                                             //     {
                                             //       keyword: 'required',
                                             //       schemaPath: '#',
                                             //       instancePath: '',
                                             //       params: { requiredProperties: [ 'y', 'z' ] },
                                             //       message: 'must have required properties y, z'
                                             //     },
                                             //     {
                                             //       keyword: 'type',
                                             //       schemaPath: '#/properties/x',
                                             //       instancePath: '/x',
                                             //       params: { type: 'number' },
                                             //       message: 'must be number'
                                             //     }
                                             //   ]
                                             // }
```