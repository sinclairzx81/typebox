# Schema.Spec

TypeBox is tested heavily against the [Official JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) for compliance against all major specification drafts.

## Supported Keywords

The following keywords are supported

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
| dependencies | 17/18 | ✅ | ✅ | ✅ | - | - | - |
| dependentRequired | - | - | - | - | ✅ | ✅ | ✅ |
| dependentSchemas | - | - | - | - | ✅ | ✅ | ✅ |
| enum | 14/16 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| exclusiveMaximum | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| exclusiveMinimum | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
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
| ref | 23/27 | 37/45 | 67/70 | 75/78 | 79/81 | 77/79 | 77/79 |
| required | 3/4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| type | 73/80 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| unevaluatedItems | - | - | - | - | ✅ | 64/71 | 64/71 |
| unevaluatedProperties | - | - | - | - | ✅ | 124/125 | 124/125 |
| uniqueItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Optional Keywords, Formats and Proposals

The following optional keywords, formats and proposals are also supported.

| Spec | 3 | 4 | 6 | 7 | 2019-09 | 2020-12 | v1 |
|:-----|:--|:--|:--|:--|:--|:--|:--|
| anchor | - | - | - | - | 3/4 | 3/4 | 3/4 |
| bignum | 7/9 | 7/9 | ✅ | ✅ | ✅ | ✅ | ✅ |
| content | - | - | - | 6/10 | - | - | - |
| cross-draft | - | - | - | 1/2 | 1/3 | 0/1 | - |
| dependencies-compatibility | - | - | - | - | ✅ | ✅ | ✅ |
| dynamicRef | - | - | - | - | - | 1/2 | 1/2 |
| ecmascript-regex | - | 69/74 | 69/74 | 69/74 | 69/74 | 69/74 | 69/74 |
| float-overflow | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-annotation | - | - | - | - | - | - | 114/133 |
| format-assertion | - | - | - | - | - | ✅ | - |
| format/color | 3/6 | - | - | - | - | - | - |
| format/date | ✅ | - | - | ✅ | ✅ | ✅ | ✅ |
| format/date-time | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/duration | - | - | - | - | ✅ | ✅ | ✅ |
| format/ecmascript-regex | 1/2 | - | - | - | - | 0/1 | 0/1 |
| format/email | ✅ | ✅ | ✅ | ✅ | ✅ | 22/27 | 22/27 |
| format/host-name | 2/12 | - | - | - | - | - | - |
| format/hostname | - | 27/28 | 27/28 | ✅ | ✅ | ✅ | ✅ |
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
| format/time | 2/3 | - | - | ✅ | ✅ | ✅ | ✅ |
| format/unknown | - | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| format/uri | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/uri-reference | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/uri-template | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format/uuid | - | - | - | - | ✅ | ✅ | ✅ |
| id | - | 2/3 | 6/7 | 6/7 | 2/3 | 2/3 | 2/3 |
| no-schema | - | - | - | - | ✅ | ✅ | - |
| non-bmp-regex | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| proposals/propertyDependencies/additionalProperties | - | - | - | - | - | - | ✅ |
| proposals/propertyDependencies/dynamicRef | - | - | - | - | - | - | 4/8 |
| proposals/propertyDependencies/propertyDependencies | - | - | - | - | - | - | 17/21 |
| proposals/propertyDependencies/unevaluatedProperties | - | - | - | - | - | - | 4/6 |
| refOfUnknownKeyword | - | - | - | - | ✅ | ✅ | ✅ |
| unknownKeyword | - | - | 1/3 | 1/3 | 1/3 | 1/3 | 1/3 |
| zeroTerminatedFloats | 0/1 | 0/1 | - | - | - | - | - |