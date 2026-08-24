# Format.IsDuration

Returns true if the string is a [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) duration

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsDuration('PT2H30M')
```

## Schema 

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'duration' }, 'PT2H30M')
```