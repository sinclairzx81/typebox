# FormatRegistry

User defined formats can be registered with the FormatRegistry

## Example

The following registers a `hex-color` format.

```typescript
import { FormatRegistry } from 'typebox/format'

// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
FormatRegistry.Set('hex-color', value => {
  
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value)
})

// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
const IsHexColor = FormatRegistry.Get('hex-color')

// ------------------------------------------------------------------
// Use
// ------------------------------------------------------------------
IsHexColor('#FF5733')                               // true
IsHexColor('#FFF')                                  // true
IsHexColor('blue')                                  // false

```

## Validation

Registered formats become available to validators using the String `format` constraint.

```typescript
const T = Type.String({ format: 'hex-color' })

const R = Value.Check(T, '#FFFFFF')                 // true

const R = Value.Check(T, 'blue')                    // false
```