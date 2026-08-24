# Format.IsTime

Returns true if the string is a [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) time component.

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsTime('14:30:00Z')
```

## Schema

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'time' }, '14:30:00Z')
```