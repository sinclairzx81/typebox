# Format

Standards-Based RFC String Validation

## Overview

The Format module contains functions to validate string formats defined in Section 7.3 ([Defined Formats](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.7.3)) of the JSON Schema specification. These formats are integrated into TypeBox's JSON Schema validation infrastructure, but can also be used independently.

## Example

The Format module is available via a submodule import.

```typescript
import Format from 'typebox/format'

const A = Format.IsEmail('user@domain.com')     // true