# Format.IsRelativeJsonPointer

Returns true if the string is a relative JSON Pointer as described in the [IETF draft](https://datatracker.ietf.org/doc/draft-handrews-relative-json-pointer/).

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsRelativeJsonPointer('0/name')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'relative-json-pointer' }, '0/name')
```