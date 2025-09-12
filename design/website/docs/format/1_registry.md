# Registry

The Format module includes Get and Set functions which can be used to define custom formats.

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

Registered formats can be used with the `format` keyword when validating schematics.

```typescript
const T = Type.String({ format: 'hex-color' })      // const T = { type: 'string', format: 'hex-color' }

const R = Value.Check(T, '#FFFFFF')                 // true

const R = Value.Check(T, 'blue')                    // false
```