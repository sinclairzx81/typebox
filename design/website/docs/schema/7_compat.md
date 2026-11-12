# Schema.Compat

TypeBox supports all versions of JSON Schema and is heavily tested against the official [JSON Schema Test Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite). It has high compatibility with modern specifications while also offering broad support for legacy versions if their semantics are not in conflict with modern specifications.

> ⚠️ TypeBox accepts schemas from any JSON Schema version, which means keywords from different versions can be mixed and matched freely. If an application needs to restrict schemas to a specific version, use the Schema.Meta namespace to validate them against that version.

## Required Keywords

| Spec | 3 | 4 | 6 | 7 | 2019-09 | 2020-12 | v1 |
|:-----|:--|:--|:--|:--|:--|:--|:--|
| additionalProperties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| allOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| anchor | - | - | - | - | ✅ | ✅ | ✅ |
| anchor-legacy | 7/14 | 7/14 | ✅ | ✅ | - | - | - |
| anyOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| boolean_schema | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| const | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| contains | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| content | - | - | - | - | ✅ | ✅ | ✅ |
| default | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| dependentRequired | 23/24 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| dependentSchemas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| disallow | 4/9 | - | - | - | - | - | - |
| dynamicRef | - | - | - | - | - | ✅ | ✅ |
| enum | 47/49 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| extends | 4/10 | - | - | - | - | - | - |
| format-color | 9/12 | - | - | - | - | - | - |
| format-date | ✅ | - | - | ✅ | ✅ | ✅ | ✅ |
| format-date-time | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-duration | - | - | - | - | ✅ | ✅ | ✅ |
| format-email | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-host-name | 14/28 | - | - | - | - | - | - |
| format-hostname | - | 28/29 | 28/29 | ✅ | ✅ | ✅ | 28/29 |
| format-idn-email | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format-idn-hostname | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format-ip-address | 11/41 | - | - | - | - | - | - |
| format-ipv4 | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-ipv6 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-iri | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format-iri-reference | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format-json-pointer | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-regex | ✅ | - | - | ✅ | ✅ | ✅ | ✅ |
| format-relative-json-pointer | - | - | - | ✅ | ✅ | ✅ | ✅ |
| format-time | 8/9 | - | - | ✅ | ✅ | ✅ | 42/45 |
| format-unknown | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| format-uri | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-uri-reference | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-uri-template | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-uuid | - | - | - | - | ✅ | ✅ | ✅ |
| id | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| id-legacy | 29/40 | 33/46 | ✅ | ✅ | - | - | - |
| if-then-else | - | - | - | ✅ | ✅ | ✅ | ✅ |
| infinite-loop-detection | - | - | - | - | ✅ | ✅ | ✅ |
| infinite-loop-detection-legacy | ✅ | ✅ | ✅ | ✅ | - | - | - |
| items | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maximum | 13/14 | 13/14 | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxLength | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| maxProperties | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minimum | 16/17 | 16/17 | ✅ | ✅ | ✅ | ✅ | ✅ |
| minItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minLength | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| minProperties | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| multipleOf | 8/13 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| not | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| oneOf | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pattern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| patternProperties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| properties | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| propertyNames | - | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| recursiveRef | - | - | - | - | ✅ | - | - |
| ref | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ref-legacy | 25/26 | 30/31 | 32/33 | 32/33 | ✅ | - | - |
| required | 3/4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| type | 92/99 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| unevaluatedItems | - | - | - | - | ✅ | ✅ | ✅ |
| unevaluatedProperties | - | - | - | - | ✅ | ✅ | ✅ |
| uniqueItems | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| vocabulary | - | - | - | - | 4/5 | 4/5 | - |

## Optional Keywords and Proposals

| Spec | 3 | 4 | 6 | 7 | 2019-09 | 2020-12 | v1 |
|:-----|:--|:--|:--|:--|:--|:--|:--|
| bignum | 15/25 | 17/26 | 18/29 | 18/29 | 18/29 | 18/29 | 18/29 |
| content | - | - | - | 6/10 | - | - | - |
| cross-draft | - | - | - | ✅ | 2/3 | 0/2 | 0/2 |
| dependencies-compatibility | - | - | - | - | ✅ | ✅ | - |
| dynamicRef | - | - | - | - | - | ✅ | ✅ |
| ecmascript-regex | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| float-overflow | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| format-assertion | - | - | - | - | - | ✅ | - |
| format-regex | ✅ | - | - | ✅ | ✅ | ✅ | ✅ |
| format-time | - | - | - | ✅ | ✅ | ✅ | - |
| non-bmp-regex | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| non-schemas | - | 5/7 | 8/10 | 8/10 | 18/20 | 18/20 | ✅ |
| proposals/propertyDependencies/additionalProperties | - | - | - | - | - | - | ✅ |
| proposals/propertyDependencies/dynamicRef | - | - | - | - | - | - | 4/8 |
| proposals/propertyDependencies/propertyDependencies | - | - | - | - | - | - | 17/21 |
| proposals/propertyDependencies/unevaluatedProperties | - | - | - | - | - | - | 4/6 |
| zero-terminated-floats | 0/1 | 0/1 | - | - | - | - | - |