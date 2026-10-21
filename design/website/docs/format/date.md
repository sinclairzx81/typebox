# Format.IsDate

Returns true if the string is a date component defined by [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339).

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsDate('2025-08-22')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'date' }, '2025-08-22')
```