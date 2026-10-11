# Format.IsUuid

Returns true if the string is a UUID described by [RFC 4122](https://www.rfc-editor.org/info/rfc4122/) and [RFC 9562](https://www.rfc-editor.org/info/rfc9562/).

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsUuid('550e8400-e29b-41d4-a716-446655440000')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'uuid' }, '550e8400-e29b-41d4-a716-446655440000')
```