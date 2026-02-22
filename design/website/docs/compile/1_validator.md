# Compile.Validator

Validators provide optimized implementations of the functions available in the Value submodule.

## Example

The following compiles a Validator and calls Check. 

```typescript
import { Compile, Validator } from 'typebox/compile'

const T = Compile(Type.Object({                     // const T: Validator<{}, TObject<{
  x: Type.Number(),                                 //   x: TNumber,
  y: Type.Number(),                                 //   y: TNumber,
  z: Type.Number(),                                 //   z: TNumber
}))                                                 // }>>

const R = T.Check({ x: 1, y: 2, z: 3 })             // const R: boolean = true


```

## Functions

The following functions are available on Validator instances.

## Check

Checks a value matches a type.

```typescript
const R = C.Check(value)                            // const R: boolean
```

## Errors

Returns a errors for the value or empty if no error.

```typescript
const R = C.Errors(value)                          // const R: ValidationError[]
```

## Clean

Cleans a value

```typescript
const R = C.Clean(value)                          // const R: unknown
```

## Code

Returns generated code for this Validator.

```typescript
const R = C.Code()                                // const R: string
```

## Convert

Converts a value

```typescript
const R = C.Convert(value)                        // const R: unknown
```

## Create

Creates a value of the Validator type

```typescript
const R = C.Create(value)                        // const R: ...
```

## Decode

Decodes a value, running any Decode callbacks if available.

```typescript
const R = C.Decode(value)                       // const R: ...
```

## Default

Creates defaults for the given value

```typescript
const R = C.Default(value)                       // const R: unknown
```

## Encode

Encodes a value, running any Encode callbacks if available.

```typescript
const R = C.Encode(value)                       // const R: ...
```

## IsEvaluated

Returns true if the Validator is using evaluated optimizations.

```typescript
const R = C.IsEvaluated()                      // const R: boolean
```

## Parse

Parses a value to the given type.

```typescript
const R = C.Parse(value)                        // const R: ...
```