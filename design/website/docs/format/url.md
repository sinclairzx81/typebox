# Format.IsUrl

Returns true if the string is a URL using the syntax defined by [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) and [RFC 3987](https://datatracker.ietf.org/doc/html/rfc3987).

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsUrl('https://example.com/path')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'url' }, 'https://example.com/path')
```