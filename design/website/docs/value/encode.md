# Value.Encode

The Encode function will execute Encode callbacks embedded within the provided type.

> ⚠️ This function may throw an error if the provided value is invalid or if a failure occurs during the eecoding process. It is recommended to wrap this function in a try / catch block.

## Example

Example usage is shown below.

```typescript
const Timestamp = Type.Codec(Type.Number())
  .Decode(value => new Date(value)) 
  .Encode(value => value.getTime())                

const T = Type.Object({
  date: Timestamp
})
 
const R = Value.Encode(T, {                         // const R = {
  date: new Date('1970-01-01T00:00:12.345Z')        //   date: 12345
})                                                  // }
```

## Pipeline

The Encode function uses the following Encoder pipeline.

```typescript
const Encoder = Pipeline([
  (_context, _type, value) => Clone(value),
  (context, type, value) => EncodeUnsafe(context, type, value), // <--- Encode First
  (context, type, value) => Default(context, type, value),
  (context, type, value) => Convert(context, type, value),
  (context, type, value) => Clean(context, type, value),
  (context, type, value) => Assert(context, type, value),
])
```

## Unsafe

The Encode function runs the full encoder pipeline to ensure Codec callbacks receive validated values. In some cases, applications may require greater control, for example, to optimize performance or integrate with functions beyond what is offered by TypeBox. For these scenarios, the Value module provides the EncodeUnsafe function, which executes Codec callbacks directly without additional processing. 

>  ⚠️ The EncodeUnsafe function returns unknown and provides no assurances the encoded value is valid. Callers must handle validation and inference manually. This is usually achieved by wrapping a pipeline in a generic function constrained by a TypeBox type.

The example below defines a reduced encoder that runs only Assert and Codec callbacks.

```typescript
import { Pipeline, Assert, EncodeUnsafe } from 'typebox/value'

// CustomEncoder

const CustomEncoder = Pipeline([
  (context, type, value) => EncodeUnsafe(context, type, value),
  (context, type, value) => { Assert(context, type, value); return value },
])

// Type + Encode

const StringToNumber = Type.Encode(Type.Number(), (value: unknown) => 
  typeof value === 'string'
    ? parseFloat(value)
    : 0
)

// Encode

const Result = CustomEncoder(StringToNumber, '123456') // const Result: unknown = 123456
```