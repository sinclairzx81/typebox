# Format.IsUriReference

Returns true if the string is a [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) URI reference

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsUriReference('https://example.com/path')
```

## Schema

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'uri-reference' }, 'https://example.com/path')
```