# Value.Pipeline

Value functions are commonly used to pre-process data before running Check or Parse operations. When multiple value functions are executed in sequence, this process is called a pipeline. TypeBox provides a Pipeline utility that allows you to compose multiple Value operations into a single callable function that follows the standard `Value.*` signature.

## Example

Example usage is shown below.

```typescript
import Value, { Pipeline } from 'typebox/value'
import Type from 'typebox'

// -------------------------------------------------------
// Pipeline: Definition
//
// The following is a custom Parse pre-processing pipeline 
// that runs a sequence of operations on a value before
// attempting to Parse. These operations can be run in
// any order. User defined pre-processing logic can 
// also be added as pipeline stages if necessary.
//
// -------------------------------------------------------
const ParsePipeline = Pipeline([
  (_context, _type, value) => Value.Clone(value),
  (context, type, value) => Value.Default(context, type, value),
  (context, type, value) => Value.Convert(context, type, value),
  (context, type, value) => Value.Clean(context, type, value),
  (context, type, value) => Value.Parse(context, type, value)
])
// -------------------------------------------------------
// Pipeline: Inference
//
// Pipelines return type `unknown` as it is not possible to 
// determine the last operation of the pipeline returned a
// correct value. As we know the Parse operation will assert
// the value, we can wrap calls to pipeline in a function
// which provides type type inference for the pipeline.
//
// -------------------------------------------------------
export function Parse<Type extends Type.TSchema>(type: Type, value: unknown): Type.Static<Type> {
  return ParsePipeline(type, value) as never
}

// -------------------------------------------------------
// Usage
// -------------------------------------------------------
const result = Parse(Type.String(), 1234)

console.log(result)
```

