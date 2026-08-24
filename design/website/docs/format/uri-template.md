# Format.IsUriTemplate

Returns true if the string is a [RFC 6570](https://www.rfc-editor.org/rfc/rfc6570.html) Uri template

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsUriTemplate('https://example.com/{user}/profile')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'uri-template' }, 'https://example.com/{user}/profile')
```