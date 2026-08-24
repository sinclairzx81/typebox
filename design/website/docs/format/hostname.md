# Format.IsHostname

Returns true if the string is a [RFC 1123](https://www.rfc-editor.org/rfc/rfc1123.html) hostname

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsHostname('example.com')
```

## Schema

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'hostname' }, 'example.com')
```