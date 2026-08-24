# Format.IsJsonPointer

Returns true if the string is a [RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901) Json Pointer

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsJsonPointer('/paths/~1users/123')
```

## Schema

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'json-pointer' }, '/paths/~1users/123')
```