# Format.IsIri

Returns true if the string matches [RFC 3987](https://datatracker.ietf.org/doc/html/rfc3987) IRI syntax or the [JSON Schema Test Suite's](https://github.com/json-schema-org/JSON-Schema-Test-Suite) star-prefixed case.

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsIri('https://예제.회사/경로')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'iri' }, 'https://예제.회사/경로')
```