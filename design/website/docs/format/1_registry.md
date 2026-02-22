# Format.Registry

Custom string formats are supported with Get and Set.

## Example

The following registers a `hex-color` format.

```typescript
import Format from 'typebox/format'

// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
Format.Set('hex-color', value => {
  
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value)
})

// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
const IsHexColor = Format.Get('hex-color')

// ------------------------------------------------------------------
// Use
// ------------------------------------------------------------------
IsHexColor('#FF5733')                               // true
IsHexColor('#FFF')                                  // true
IsHexColor('blue')                                  // false

```

## Validation

Once registered, custom formats become available to validators and can be referenced using the `format` keyword.

```typescript
const T = Type.String({ format: 'hex-color' })      // const T = { type: 'string', format: 'hex-color' }

const R = Value.Check(T, '#FFFFFF')                 // true

const R = Value.Check(T, 'blue')                    // false
```