# Format.IsUrl

Returns true if the string is a URL

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsUrl('https://example.com/path')
```

## Schema

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'url' }, 'https://example.com/path')
```