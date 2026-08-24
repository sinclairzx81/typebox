# Format.IsUuid

Returns true if the string is a RFC 4122 UUID

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsUuid('550e8400-e29b-41d4-a716-446655440000')
```

## Schema

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'uuid' }, '550e8400-e29b-41d4-a716-446655440000')
```