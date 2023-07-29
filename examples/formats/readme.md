# Formats

This example provides TypeCompiler supported versions of the `ajv-formats` package.

## Standard

The `standard.ts` file provided with this example implements several standard string formats. 

| Format      | Description |
| ---         | --- |
| `email`     | Internet email address, see [RFC 5321, section 4.1.2.](http://tools.ietf.org/html/rfc5321#section-4.1.2) |
| `date-time` | ISO8601 DateTime. example, `2018-11-13T20:20:39+00:00` |
| `date`      | ISO8601 Date component, for example, `2018-11-13`                                  |
| `time`      | ISO8601 Time component, for example, `20:20:39+00:00`                              |
| `uuid`      | A Universally Unique Identifier as defined by [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122). |
| `url`       | A uniform resource locator as defined in [RFC 1738](https://www.rfc-editor.org/rfc/rfc1738)
| `ipv4`      | IPv4 address, according to dotted-quad ABNF syntax as defined in [RFC 2673, section 3.2](http://tools.ietf.org/html/rfc2673#section-3.2). |
| `ipv6`      | IPv6 address, as defined in [RFC 2373, section 2.2](http://tools.ietf.org/html/rfc2373#section-2.2). |

