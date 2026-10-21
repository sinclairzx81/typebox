# Format.IsHostname

Returns true if the string is a hostname conforming to [RFC 1123](https://www.rfc-editor.org/rfc/rfc1123.html), with internationalized domain names supported by [RFC 5891](https://datatracker.ietf.org/doc/html/rfc5891), [RFC 5892](https://datatracker.ietf.org/doc/html/rfc5892), and [RFC 5893](https://datatracker.ietf.org/doc/html/rfc5893).

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsHostname('example.com')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'hostname' }, 'example.com')
```