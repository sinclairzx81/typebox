# Format.IsRegex

Returns true if the string is a regular expression

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsRegex('^\\d{3}-\\d{2}-\\d{4}$')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'regex' }, '^\\d{3}-\\d{2}-\\d{4}$')
```