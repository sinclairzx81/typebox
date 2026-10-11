# Format.IsUriReference

Returns true if the string is a URI reference conforming to [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986).

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsUriReference('https://example.com/path')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'uri-reference' }, 'https://example.com/path')
```