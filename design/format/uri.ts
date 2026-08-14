/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

// ------------------------------------------------------------------
// Uri Grammar
//
// Regex source fragments composing the RFC 3986 URI grammar and the
// RFC 6570 URI Template grammar.
//
// @specification https://tools.ietf.org/html/rfc3986
// @specification https://tools.ietf.org/html/rfc6570
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Core character classes
//
// The unreserved, sub-delims and pct-encoded productions shared by
// almost every other fragment in this module. In Unreserved, the
// hyphen is placed first and left unescaped, which is only safe
// because every call site below interpolates it as the first
// fragment inside its own character class.
// ------------------------------------------------------------------

export const Pct = `%[0-9a-f]{2}`
export const Unreserved = `-a-z0-9._~`
export const SubDelims = `!$&'()*+,;=`

// ------------------------------------------------------------------
// Scheme
// ------------------------------------------------------------------

export const Scheme = `[a-z][a-z0-9+\\-.]*`

// ------------------------------------------------------------------
// IPv4
//
// The dec-octet production forbids leading zeros and caps each
// octet at 255, per RFC 3986. It is the highest leverage fragment
// in this module: it gets expanded 32 times in the final Uri
// output (four times per Ipv4, with Ipv4 itself expanded eight
// times through Ls32 and Host), so every character trimmed here is
// worth roughly 32 characters in the compiled regex.
// ------------------------------------------------------------------

export const DecOctet = `(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)`
export const Ipv4 = `(?:${DecOctet}\\.){3}${DecOctet}`

// ------------------------------------------------------------------
// IPv6
//
// The full nine alternative RFC 3986 IPv6address grammar, built
// from h16 and ls32. Each alternative below is a direct translation
// of one branch of the ABNF. Ls32 always counts as two groups worth
// of bits, whether it is written as h16:h16 or as an embedded IPv4
// address, so every branch's group counts sum to eight. That sum is
// exactly what the nine way split exists to enforce, since plain
// regex alternation cannot express a total count constraint on its
// own.
// ------------------------------------------------------------------

const H16 = `[\\da-f]{1,4}`
const Ls32 = `(?:${H16}:${H16}|${Ipv4})`

export const Ipv6 = [
  `(?:${H16}:){6}${Ls32}`,
  `::(?:${H16}:){5}${Ls32}`,
  `(?:${H16})?::(?:${H16}:){4}${Ls32}`,
  `(?:(?:${H16}:){0,1}${H16})?::(?:${H16}:){3}${Ls32}`,
  `(?:(?:${H16}:){0,2}${H16})?::(?:${H16}:){2}${Ls32}`,
  `(?:(?:${H16}:){0,3}${H16})?::${H16}:${Ls32}`,
  `(?:(?:${H16}:){0,4}${H16})?::${Ls32}`,
  `(?:(?:${H16}:){0,5}${H16})?::${H16}`,
  `(?:(?:${H16}:){0,6}${H16})?::`,
].join('|')

// ------------------------------------------------------------------
// IPvFuture / IP-literal
//
// IpvFuture reserves the "v" prefixed form for address types beyond
// IPv6. IpLiteral is the bracketed host form covering both Ipv6 and
// IpvFuture.
// ------------------------------------------------------------------

export const IpvFuture = `v[0-9a-f]+\\.[${Unreserved}${SubDelims}:]+`
export const IpLiteral = `\\[(?:(?:${Ipv6})|${IpvFuture})\\]`

// ------------------------------------------------------------------
// Host, port, userinfo, authority
// ------------------------------------------------------------------

export const RegName = `(?:[${Unreserved}${SubDelims}]|${Pct})*`
export const Host = `(?:${IpLiteral}|${Ipv4}|${RegName})`
export const UserInfo = `(?:[${Unreserved}${SubDelims}:]|${Pct})*`
export const Port = `(?::\\d*)?`
export const Authority = `(?:${UserInfo}@)?${Host}${Port}`

// ------------------------------------------------------------------
// Path segments
// ------------------------------------------------------------------

export const PChar = `(?:[${Unreserved}${SubDelims}:@]|${Pct})`
export const PCharNoColon = `(?:[${Unreserved}${SubDelims}@]|${Pct})`

export const PathAbEmpty = `(?:/${PChar}*)*`
export const PathAbsolute = `/(?:${PChar}+${PathAbEmpty})?`
export const PathNoScheme = `${PCharNoColon}+${PathAbEmpty}`
export const PathRootless = `${PChar}+${PathAbEmpty}`

// ------------------------------------------------------------------
// Query / fragment
// ------------------------------------------------------------------

export const QueryOrFragment = `(?:[${Unreserved}${SubDelims}:@/?]|${Pct})*`

// ------------------------------------------------------------------
// URI Template fragments (RFC 6570)
//
// RFC 6570 reuses RFC 3986's pct-encoded production verbatim, so Pct
// is reused directly. Everything below is specific to level one
// through four URI Templates and has no RFC 3986 equivalent to
// share.
//
// Literal matches a single character outside any expression, apart
// from the control range, space, and the characters that must be
// percent encoded instead (", <, >, an unencoded %, backslash, the
// caret, backtick, and the brace and pipe characters, plus DEL).
//
// Operator is the optional lead character of an expression: one of
// +, #, ., /, ;, ?, &, =, comma, !, @ or | (the last four of those
// are reserved by the RFC for future extension, but the original
// pattern already accepted them, so that is preserved here).
//
// VarChar, VarName, Modifier and VarSpec build up a single template
// variable, matching the RFC's varchar, varname and modifier level
// four productions. Expression is a full "{operator varspec, ...}"
// block.
// ------------------------------------------------------------------

const Literal = `(?:[^\\x00-\\x20"<>%\\\\^\`{|}\\x7f]|${Pct})`
const Operator = `[+#./;?&=,!@|]`
const VarChar = `(?:[a-z0-9_]|${Pct})`
const VarName = `${VarChar}+(?:\\.${VarChar}+)*`
const Modifier = `(?::[1-9]\\d{0,3}|\\*)?`
const VarSpec = `${VarName}${Modifier}`
const Expression = `\\{${Operator}?${VarSpec}(?:,${VarSpec})*\\}`

// ------------------------------------------------------------------
// Uri
// ------------------------------------------------------------------

export const HierPart = `(?://${Authority}${PathAbEmpty}|${PathAbsolute}|${PathRootless})?`
export const Uri = `^${Scheme}:${HierPart}(?:\\?${QueryOrFragment})?(?:#${QueryOrFragment})?$`

// ------------------------------------------------------------------
// UriReference
// ------------------------------------------------------------------

export const RelativePart = `(?://${Authority}${PathAbEmpty}|${PathAbsolute}|${PathNoScheme})?`
export const UriReference = `^(?:${Scheme}:${HierPart}|${RelativePart})(?:\\?${QueryOrFragment})?(?:#${QueryOrFragment})?$`

// ------------------------------------------------------------------
// UriTemplate
// ------------------------------------------------------------------

export const UriTemplate = `^(?:${Literal}|${Expression})*$`

// ------------------------------------------------------------------
// Output
// ------------------------------------------------------------------

console.log({
  UriTemplate: new RegExp(UriTemplate, 'i'),
  UriReference: new RegExp(UriReference, 'i'),
  Uri: new RegExp(Uri, 'i')
})