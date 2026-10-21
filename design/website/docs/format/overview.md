# Format

Standard String Format Validation

## Overview

The Format module contains validators for the string formats defined in Section 7.3 ([Defined Formats](https://json-schema.org/draft/2020-12/json-schema-validation)) of the JSON Schema specification. These validators are integrated into TypeBox's JSON Schema validation infrastructure, but can also be used independently to check strings without invoking JSON Schema validation.

## Example

The Format module is available via a submodule import.

```typescript
import Format from 'typebox/format'

const A = Format.IsEmail('user@domain.com')     // true
```

## Length

Formats that check strings of arbitrary length are written to scale approximately linearly with respect to input length and are uncapped by default. The only exceptions are IsIdnHostname and IsIdnEmail, which return false for input longer than 65,536 UTF-16 code units due to their complexity.

> ⚠️ Even with linear scaling, whoever supplies untrusted input controls how much work you do. It is recommended that you limit input length before validation, either by comparing the length to a maximum or by using the maxLength keyword in JSON Schema. Choose the limit with these costs in mind: IsRegex takes about 1.9 ms at 256K, and IsIdnHostname takes about 4.3 ms at 64K. Also note that maxLength counts Unicode code points, while string length in many runtimes counts UTF-16 code units.

## Performance

The table below shows measured time as input length increases, where K is 1,024 UTF-16 code units. Entries marked with an asterisk (\*) belong to formats with a fixed maximum valid length. They reject longer input immediately, so their time is constant. Entries marked --- were not measured because the input exceeds the 65,536 limit.

| Format | 4K | 8K | 16K | 32K | 64K | 128K | 256K |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IsDate | 0.14 µs | 0.11 µs | 0.11 µs | 0.10 µs | 0.13 µs | 0.12 µs | 0.14 µs |
| IsDateTime | 6.96 µs | 14.30 µs | 27.19 µs | 54.16 µs | 108.59 µs | 216.99 µs | 432.23 µs |
| IsDuration | 4.46 µs | 8.76 µs | 17.39 µs | 34.64 µs | 92.99 µs | 185.39 µs | 370.92 µs |
| IsEmail | 14.68 µs | 29.01 µs | 57.95 µs | 115.09 µs | 230.08 µs | 459.46 µs | 928.04 µs |
| IsHostname | 0.10 µs* | 0.06 µs* | 0.12 µs* | 0.06 µs* | 0.07 µs* | 0.07 µs* | 0.13 µs* |
| IsIdnEmail | 34.20 µs | 65.13 µs | 127.55 µs | 252.00 µs | 501.40 µs | --- | --- |
| IsIdnHostname | 197.67 µs | 470.74 µs | 1078.67 µs | 2190.45 µs | 4392.38 µs | --- | --- |
| IsIPv4 | 0.10 µs* | 0.05 µs* | 0.24 µs* | 0.05 µs* | 0.06 µs* | 0.05 µs* | 0.04 µs* |
| IsIPv6 | 0.28 µs* | 0.26 µs* | 0.33 µs* | 0.26 µs* | 0.26 µs* | 0.27 µs* | 0.24 µs* |
| IsIriReference | 10.09 µs | 20.09 µs | 39.16 µs | 77.86 µs | 156.21 µs | 313.04 µs | 626.67 µs |
| IsIri | 7.80 µs | 14.60 µs | 28.67 µs | 56.94 µs | 114.33 µs | 229.14 µs | 457.22 µs |
| IsJsonPointerUriFragment | 15.95 µs | 30.89 µs | 62.01 µs | 123.62 µs | 247.00 µs | 494.02 µs | 989.88 µs |
| IsJsonPointer | 13.63 µs | 26.96 µs | 53.97 µs | 107.64 µs | 228.91 µs | 461.82 µs | 919.16 µs |
| IsRegex | 32.56 µs | 60.49 µs | 116.58 µs | 228.15 µs | 451.59 µs | 967.63 µs | 1900.47 µs |
| IsRelativeJsonPointer | 12.76 µs | 25.12 µs | 49.97 µs | 99.86 µs | 200.14 µs | 402.09 µs | 800.49 µs |
| IsTime | 14.93 µs | 31.74 µs | 63.34 µs | 126.68 µs | 253.24 µs | 505.73 µs | 957.35 µs |
| IsUriReference | 25.18 µs | 49.83 µs | 100.01 µs | 199.41 µs | 398.85 µs | 800.47 µs | 1595.42 µs |
| IsUriTemplate | 12.31 µs | 25.00 µs | 49.77 µs | 95.77 µs | 200.25 µs | 398.54 µs | 767.38 µs |
| IsUri | 21.59 µs | 42.40 µs | 84.44 µs | 169.03 µs | 338.28 µs | 673.81 µs | 1341.51 µs |
| IsUrl | 4.04 µs | 7.82 µs | 15.45 µs | 30.69 µs | 61.12 µs | 122.84 µs | 243.70 µs |
| IsUuid | 0.31 µs | 0.22 µs | 0.33 µs | 0.22 µs | 0.25 µs | 0.21 µs | 0.21 µs |


