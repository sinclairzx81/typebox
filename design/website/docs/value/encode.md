# Encode

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
  (context, type, value) => Encode(context, type, value),   // <--- Encode First
  (context, type, value) => Default(context, type, value),
  (context, type, value) => Convert(context, type, value),
  (context, type, value) => Clean(context, type, value),
  (context, type, value) => Assert(context, type, value),
])
```