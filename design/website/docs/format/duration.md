# Format.IsDuration

Returns true if the string is a duration conforming to [RFC 3339, Appendix A](https://www.rfc-editor.org/rfc/rfc3339.html#appendix-A).

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