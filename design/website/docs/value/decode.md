# Value.Decode

The Decode function will execute Decode callbacks embedded within the provided type. 

> ⚠️ This function may throw an error if the provided value is invalid or if a failure occurs during the decoding process. It is recommended to wrap this function in a try / catch block.

## Example

Example usage is shown below.

```typescript
const Timestamp = Type.Codec(Type.Number())
  .Decode(value => new Date(value))                 
  .Encode(value => value.getTime())

const T = Type.Object({
  date: Timestamp
})

const R = Value.Decode(T, { date: 12345 })          // const R = {
                                                    //   date: 1970-01-01T00:00:12.345Z
                                                    // }
```

## Pipeline

The Decode function uses the following Decoder pipeline.

```typescript
const Decoder = Pipeline([
  (_context, _type, value) => Clone(value),
  (context, type, value) => Default(context, type, value),
  (context, type, value) => Convert(context, type, value),
  (context, type, value) => Clean(context, type, value),
  (context, type, value) => Assert(context, type, value),
  (context, type, value) => DecodeUnsafe(context, type, value) // <--- Decode Last
])
```

## Unsafe

The Decode function runs the full decoder pipeline to ensure Codec callbacks receive validated values. In some cases, applications may require greater control, for example, to optimize performance or integrate with functions beyond what is offered by TypeBox. For these scenarios, the Value module provides the DecodeUnsafe function, which executes Codec callbacks directly without additional processing. 

>  ⚠️ The DecodeUnsafe function returns unknown and provides no assurances the decoded value is valid. Callers must handle validation and inference manually. This is usually achieved by wrapping a pipeline in a generic function constrained by a TypeBox type.

The example below defines a reduced decoder that runs only Assert and Codec callbacks.

```typescript

import { Pipeline, Assert, DecodeUnsafe } from 'typebox/value'

// CustomDecoder

const CustomDecoder = Pipeline([
  (context, type, value) => { Assert(context, type, value); return value },
  (context, type, value) => DecodeUnsafe(context, type, value)
])

// Type + Decode

const NumberToString = Type.Decode(Type.Number(), value => value.toString())

// Result

const Result = CustomDecoder(NumberToString, 123456) // const Result: unknown = "123456"
```