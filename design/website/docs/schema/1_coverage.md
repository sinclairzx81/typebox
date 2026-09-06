# Schema.Coverage

TypeBox has broad coverage for all major JSON Schema drafts and is verified against the [Official JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite). TypeBox uses a progressive adoption strategy where legacy specifications are supported wherever they can be reconciled with the modern specification. Where they cannot, the modern specification takes precedence.

> ⚠️ TypeBox does not require a specific draft version by default; it will accept schematics from any supported draft. If an implementation needs to mandate a specific draft, use the Schema.Meta namespace to validate schematics against that draft version. TypeBox treats meta schema validation the same as ordinary schema validation, allowing developers to progressively upgrade to modern specifications without exhaustive schema rewrites.

The following shows test coverage for each draft.

## Required Keywords

| Spec | 3 | 4 | 6 | 7 | 2019-09 | 2020-12 | v1 |
|:-----|:--|:--|:--|:--|:--|:--|:--|
| additionalItems | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| additionalProperties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| allOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| anchor | - | - | - | - | ✅ | ✅ | ✅ |
| anyOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| boolean_schema | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| const | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| contains | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| content | - | - | - | - | ✅ | ✅ | ✅ |
| default | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| definitions | - | 1/2 | ✅ | ✅ | - | - | - |
| defs | - | - | - | - | ✅ | ✅ | - |
| dependencies | 17/18 | ✅ | ✅ | ✅ | - | - | - |
| dependentRequired | - | - | - | - | ✅ | ✅ | ✅ |
| dependentSchemas | - | - | - | - | ✅ | ✅ | ✅ |
| dynamicRef | - | - | - | - | - | ✅ | ✅ |
| enum | 16/18 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| exclusiveMaximum | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| exclusiveMinimum | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format | ✅ | ✅ | ✅ | ✅ | ✅ | 114/133 | - |
| if-then-else | - | - | - | ✅ | ✅ | ✅ | ✅ |
| infinite-loop-detection | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| items | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxContains | - | - | - | - | ✅ | ✅ | ✅ |
| maximum | 13/14 | 13/14 | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxLength | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxProperties | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minContains | - | - | - | - | ✅ | ✅ | ✅ |
| minimum | 12/13 | 16/17 | ✅ | ✅ | ✅ | ✅ | ✅ |
| minItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minLength | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minProperties | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| multipleOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| not | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| oneOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pattern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| patternProperties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| prefixItems | - | - | - | - | - | ✅ | ✅ |
| properties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| propertyNames | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| recursiveRef | - | - | - | - | ✅ | - | - |
| ref | 23/27 | 38/45 | 69/70 | 77/78 | ✅ | ✅ | ✅ |
| refRemote | 7/8 | 11/17 | ✅ | ✅ | ✅ | ✅ | ✅ |
| required | 3/4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| type | 73/80 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| unevaluatedItems | - | - | - | - | ✅ | ✅ | ✅ |
| unevaluatedProperties | - | - | - | - | ✅ | ✅ | ✅ |
| uniqueItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Optional Keywords and Proposals

| Spec | 3 | 4 | 6 | 7 | 2019-09 | 2020-12 | v1 |
|:-----|:--|:--|:--|:--|:--|:--|:--|
| anchor | - | - | - | - | ✅ | ✅ | ✅ |
| bignum | 7/9 | 7/9 | ✅ | ✅ | ✅ | ✅ | ✅ |
| content | - | - | - | 6/10 | - | - | - |
| cross-draft | - | - | - | ✅ | 2/3 | 0/1 | - |
| dependencies-compatibility | - | - | - | - | ✅ | ✅ | ✅ |
| dynamicRef | - | - | - | - | - | ✅ | ✅ |
| ecmascript-regex | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| float-overflow | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-annotation | - | - | - | - | - | - | 114/133 |
| format-assertion | - | - | - | - | - | ✅ | - |
| format/color | 3/6 | - | - | - | - | - | - |
| format/date | ✅ | - | - | ✅ | ✅ | ✅ | ✅ |
| format/date-time | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/duration | - | - | - | - | ✅ | ✅ | ✅ |
| format/ecmascript-regex | ✅ | - | - | ✅ | ✅ | ✅ | ✅ |
| format/email | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/host-name | 2/12 | - | - | - | - | - | - |
| format/hostname | - | 30/31 | 30/31 | ✅ | ✅ | ✅ | ✅ |
| format/idn-email | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format/idn-hostname | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format/ip-address | 1/3 | - | - | - | - | - | - |
| format/ipv4 | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/ipv6 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/iri | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format/iri-reference | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format/json-pointer | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/regex | ✅ | - | - | ✅ | ✅ | ✅ | ✅ |
| format/relative-json-pointer | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format/time | 2/3 | - | - | ✅ | ✅ | ✅ | 49/55 |
| format/unknown | - | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| format/uri | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/uri-reference | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/uri-template | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/uuid | - | - | - | - | ✅ | ✅ | ✅ |
| id | - | 2/3 | ✅ | ✅ | ✅ | ✅ | ✅ |
| no-schema | - | - | - | - | ✅ | ✅ | - |
| non-bmp-regex | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| proposals/propertyDependencies/additionalProperties | - | - | - | - | - | - | ✅ |
| proposals/propertyDependencies/dynamicRef | - | - | - | - | - | - | 4/8 |
| proposals/propertyDependencies/propertyDependencies | - | - | - | - | - | - | 17/21 |
| proposals/propertyDependencies/unevaluatedProperties | - | - | - | - | - | - | 4/6 |
| refOfUnknownKeyword | - | - | - | - | ✅ | ✅ | ✅ |
| unknownKeyword | - | - | 1/3 | 1/3 | 1/3 | 1/3 | 1/3 |
| zeroTerminatedFloats | 0/1 | 0/1 | - | - | - | - | - |