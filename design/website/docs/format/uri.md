# Format.IsUri

Returns true if the string is a [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) URI

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsUri('https://example.com/path')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'uri' }, 'https://example.com/path')
```