# Format.IsDateTime

Returns true if the string is an [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) date-time.

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsDateTime('2025-08-22T14:30:00Z')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'date-time' }, '2025-08-22T14:30:00Z')
```