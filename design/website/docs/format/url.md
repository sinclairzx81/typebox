# Format.IsUrl

Returns true if the string is a URL

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsUrl('https://example.com/path')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'url' }, 'https://example.com/path')
```