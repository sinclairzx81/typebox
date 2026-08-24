# Format.IsIri

Returns true if the string is an IRI

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsIri('https://예제.회사/경로')
```

## Schema

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'iri' }, 'https://예제.회사/경로')
```