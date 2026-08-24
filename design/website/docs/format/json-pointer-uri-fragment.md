# Format.IsJsonPointerUriFragment

Returns true if the string is a [RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901) Json Pointer URI fragment

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsJsonPointerUriFragment('#/paths/~1users/123')
```

## Schema

Test with format keyword

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'json-pointer-uri-fragment' }, '#/paths/~1users/123')
```