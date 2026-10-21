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
// CHAR
// ------------------------------------------------------------------
const CHAR_DIGIT = '\\d'
const CHAR_HEX_DIGIT = '[0-9a-fA-F]'
const CHAR_HEX_PAIR = `${CHAR_HEX_DIGIT}{2}`
// ------------------------------------------------------------------
// ADDR
// ------------------------------------------------------------------
const ADDR_LOCAL_ATOM_CHARS = `a-z${CHAR_DIGIT}!#$%&'*+/=?^_\`{|}~`
const ADDR_DEC_OCTET = `(?:25[0-5]|2[0-4]${CHAR_DIGIT}|1${CHAR_DIGIT}${CHAR_DIGIT}|[1-9]?${CHAR_DIGIT})`
const ADDR_IPV4 = `(?:${ADDR_DEC_OCTET}\\.){3}${ADDR_DEC_OCTET}`
const ADDR_H16 = `${CHAR_HEX_DIGIT}{1,4}`
const ADDR_LS32 = `(?:${ADDR_H16}:${ADDR_H16}|${ADDR_IPV4})`
const ADDR_IPV6 = [
  `(?:${ADDR_H16}:){6}${ADDR_LS32}`,
  `::(?:${ADDR_H16}:){5}${ADDR_LS32}`,
  `(?:${ADDR_H16})?::(?:${ADDR_H16}:){4}${ADDR_LS32}`,
  `(?:(?:${ADDR_H16}:){0,1}${ADDR_H16})?::(?:${ADDR_H16}:){3}${ADDR_LS32}`,
  `(?:(?:${ADDR_H16}:){0,2}${ADDR_H16})?::(?:${ADDR_H16}:){2}${ADDR_LS32}`,
  `(?:(?:${ADDR_H16}:){0,3}${ADDR_H16})?::${ADDR_H16}:${ADDR_LS32}`,
  `(?:(?:${ADDR_H16}:){0,4}${ADDR_H16})?::${ADDR_LS32}`,
  `(?:(?:${ADDR_H16}:){0,5}${ADDR_H16})?::${ADDR_H16}`,
  `(?:(?:${ADDR_H16}:){0,6}${ADDR_H16})?::`
].join('|')
// ------------------------------------------------------------------
// HOST
// ------------------------------------------------------------------
const HOST_ASCII_LDH_LABEL_CONTENT = `[a-z${CHAR_DIGIT}]+(?:-+[a-z${CHAR_DIGIT}]+)*`
const HOST_ASCII_LDH_LABEL = `(?![a-z${CHAR_DIGIT}-]{64})${HOST_ASCII_LDH_LABEL_CONTENT}`
const HOST_ASCII_LDH_DOMAIN = `(?:${HOST_ASCII_LDH_LABEL})(?:\\.(?:${HOST_ASCII_LDH_LABEL}))*`
const HOST_ASCII_LDH_HOSTNAME_LABEL = `(?![a-z${CHAR_DIGIT}]{2}--)[a-z${CHAR_DIGIT}](?:[a-z${CHAR_DIGIT}-]{0,61}[a-z${CHAR_DIGIT}])?`
const HOST_ASCII_LDH_HOSTNAME = `(?:${HOST_ASCII_LDH_HOSTNAME_LABEL})(?:\\.(?:${HOST_ASCII_LDH_HOSTNAME_LABEL}))*`
// ------------------------------------------------------------------
// EMAIL
// ------------------------------------------------------------------
const EMAIL_ATOM = `[${ADDR_LOCAL_ATOM_CHARS}-]+`
const EMAIL_IDN_ATOM = `[${ADDR_LOCAL_ATOM_CHARS}\\u{0080}-\\u{10FFFF}-]+`
const EMAIL_ASCII_LOCAL_PART = `${EMAIL_ATOM}(?:\\.${EMAIL_ATOM})*`
const EMAIL_ASCII_DOMAIN = `${HOST_ASCII_LDH_LABEL_CONTENT}(?:\\.${HOST_ASCII_LDH_LABEL_CONTENT})+`
const EMAIL_QUOTED_TEXT = `[\\x20\\x21\\x23-\\x5b\\x5d-\\x7e]`
const EMAIL_QUOTED_PAIR = `\\\\[\\x20-\\x7e]`
const EMAIL_IDN_QUOTED_TEXT = `[^\\p{Cc}\\p{Zl}\\p{Zp}"\\\\]`
const EMAIL_LOCAL_PART = `(?:${EMAIL_ATOM}(?:\\.${EMAIL_ATOM})*|"(?:${EMAIL_QUOTED_TEXT}|${EMAIL_QUOTED_PAIR})*")`
const EMAIL_IP_LITERAL = `\\[(?:IPv6:(?:${ADDR_IPV6})|${ADDR_IPV4})\\]`
const EMAIL_DOMAIN = `(?:${EMAIL_IP_LITERAL}|${HOST_ASCII_LDH_DOMAIN})`
const EMAIL_IDN_LOCAL_PART = `(?:${EMAIL_IDN_ATOM}(?:\\.${EMAIL_IDN_ATOM})*|"(?:${EMAIL_IDN_QUOTED_TEXT}|${EMAIL_QUOTED_PAIR})*")`
// ------------------------------------------------------------------
// TIME
// ------------------------------------------------------------------
const TIME_TWO_DIGITS = `${CHAR_DIGIT}{2}`
const TIME_FOUR_DIGITS = `${CHAR_DIGIT}{4}`
const TIME_OFFSET_HOUR = `(?:[01]${CHAR_DIGIT}|2[0-3])`
const TIME_OFFSET_MINUTE = `[0-5]${CHAR_DIGIT}`
const TIME_NUMERIC_OFFSET = `[+-]${TIME_OFFSET_HOUR}:${TIME_OFFSET_MINUTE}`
const TIME_TIME_ZONE_PART = `(?!\\.{1,2}[/\\]])[A-Za-z._][A-Za-z._${CHAR_DIGIT}+-]{0,13}`
const TIME_TIME_ZONE = `\\[!?(?:${TIME_TIME_ZONE_PART}(?:/${TIME_TIME_ZONE_PART})*|${TIME_NUMERIC_OFFSET})\\]`
const TIME_SUFFIX_VALUE = `[A-Za-z${CHAR_DIGIT}]+`
const TIME_SUFFIX_TAG = `\\[!?[a-z_][a-z_${CHAR_DIGIT}-]*=${TIME_SUFFIX_VALUE}(?:-${TIME_SUFFIX_VALUE})*\\]`
const TIME_SUFFIX = `(?:${TIME_TIME_ZONE}(?:${TIME_SUFFIX_TAG})*|(?:${TIME_SUFFIX_TAG})*)`
// ------------------------------------------------------------------
// URI
// ------------------------------------------------------------------
const URI_PCT = `%${CHAR_HEX_PAIR}`
const URI_UNRESERVED = `-a-z${CHAR_DIGIT}._~`
const URI_SUB_DELIMS = `!$&'()*+,;=`
const URI_SCHEME = `[a-z][a-z${CHAR_DIGIT}+\\-.]*`
const URI_IP_LITERAL = `\\[(?:${ADDR_IPV6})\\]`
const URI_REG_NAME = `(?:[${URI_UNRESERVED}${URI_SUB_DELIMS}]|${URI_PCT})*`
const URI_HOST = `(?:${URI_IP_LITERAL}|${ADDR_IPV4}|${URI_REG_NAME})`
const URI_USER_INFO = `(?:[${URI_UNRESERVED}${URI_SUB_DELIMS}:]|${URI_PCT})*`
const URI_PORT = `(?::${CHAR_DIGIT}*)?`
const URI_AUTHORITY = `(?:${URI_USER_INFO}@)?${URI_HOST}${URI_PORT}`
const URI_PCHAR = `(?:[${URI_UNRESERVED}${URI_SUB_DELIMS}:@]|${URI_PCT})`
const URI_PCHAR_NO_COLON = `(?:[${URI_UNRESERVED}${URI_SUB_DELIMS}@]|${URI_PCT})`
const URI_PATH_ABEMPTY = `(?:/${URI_PCHAR}*)*`
const URI_PATH_ABSOLUTE = `/(?:${URI_PCHAR}+${URI_PATH_ABEMPTY})?`
const URI_PATH_NO_SCHEME = `${URI_PCHAR_NO_COLON}+${URI_PATH_ABEMPTY}`
const URI_PATH_ROOTLESS = `${URI_PCHAR}+${URI_PATH_ABEMPTY}`
const URI_QUERY_OR_FRAGMENT = `(?:[${URI_UNRESERVED}${URI_SUB_DELIMS}:@/?]|${URI_PCT})*`
const URI_HIER_PART = `(?://${URI_AUTHORITY}${URI_PATH_ABEMPTY}|${URI_PATH_ABSOLUTE}|${URI_PATH_ROOTLESS})?`
const URI_RELATIVE_PART = `(?://${URI_AUTHORITY}${URI_PATH_ABEMPTY}|${URI_PATH_ABSOLUTE}|${URI_PATH_NO_SCHEME})?`
const URI_LITERAL = `(?:[^\\x00-\\x20"<>%\\\\^\`{|}\\x7f]|${URI_PCT})`
const URI_OPERATOR = `[+#./;?&=,!@|]`
const URI_VAR_CHAR = `(?:[A-Za-z${CHAR_DIGIT}_]|${URI_PCT})`
const URI_VAR_NAME = `${URI_VAR_CHAR}+(?:\\.${URI_VAR_CHAR}+)*`
const URI_MODIFIER = `(?::[1-9]${CHAR_DIGIT}{0,3}|\\*)?`
const URI_VAR_SPEC = `${URI_VAR_NAME}${URI_MODIFIER}`
const URI_EXPRESSION = `\\{${URI_OPERATOR}?${URI_VAR_SPEC}(?:,${URI_VAR_SPEC})*\\}`
// ------------------------------------------------------------------
// IRI
// ------------------------------------------------------------------
const IRI_INVALID_CHARS = '[\\x00-\\x20\\x7f"<>\\^`{|}\\\\]'
const IRI_INVALID_PERCENT_ENCODING = `%(?!${CHAR_HEX_PAIR})`
const IRI_REFERENCE_INVALID_CHARS = `${IRI_INVALID_CHARS}|${IRI_INVALID_PERCENT_ENCODING}`
const IRI_REFERENCE_MALFORMED_SCHEME = `^(?:${URI_SCHEME}\\/\\/|(?!(?:${URI_SCHEME}:))[^/?#]*:)`
// ------------------------------------------------------------------
// URL
// ------------------------------------------------------------------
const URL_SCHEME = '(?:https?|wss?|ftps?)'
const URL_USER_INFO = `(?:[^\\s/?#@\\\\]*@)?`
const URL_IPV4_EXCLUDED_RANGES = [
  `(?!(?:10|127)(?:\\.${CHAR_DIGIT}{1,3}){3})`,
  `(?!(?:169\\.254|192\\.168)(?:\\.${CHAR_DIGIT}{1,3}){2})`,
  `(?!172\\.(?:1[6-9]|2${CHAR_DIGIT}|3[0-1])(?:\\.${CHAR_DIGIT}{1,3}){2})`
].join('')
const URL_IPV4_FIRST_OCTET = `(?:[1-9]${CHAR_DIGIT}?|1${CHAR_DIGIT}{2}|2[01]${CHAR_DIGIT}|22[0-3])`
const URL_IPV4_MIDDLE_OCTET = `(?:1?${CHAR_DIGIT}{1,2}|2[0-4]${CHAR_DIGIT}|25[0-5])`
const URL_IPV4_LAST_OCTET = `(?:[1-9]${CHAR_DIGIT}?|1${CHAR_DIGIT}{2}|2[0-4]${CHAR_DIGIT}|25[0-4])`
const URL_IPV4 = `${URL_IPV4_EXCLUDED_RANGES}${URL_IPV4_FIRST_OCTET}(?:\\.${URL_IPV4_MIDDLE_OCTET}){2}\\.${URL_IPV4_LAST_OCTET}`
const URL_DOMAIN_CHAR = `[a-z${CHAR_DIGIT}\\u{00a1}-\\u{ffff}]`
const URL_DOMAIN_LABEL = `(?:${URL_DOMAIN_CHAR}+-)*${URL_DOMAIN_CHAR}+`
const URL_TLD = `[a-z\\u{00a1}-\\u{ffff}]{2,}`
const URL_DOMAIN = `(?:${URL_DOMAIN_LABEL})(?:\\.(?:${URL_DOMAIN_LABEL}))*(?:\\.(?:${URL_TLD}))`
const URL_HOST = `(?:${URL_IPV4}|${URL_DOMAIN})`
const URL_PORT = `(?::${CHAR_DIGIT}{2,5})?`
const URL_PATH = `(?:/[^\\s\\\\]*)?`
// ------------------------------------------------------------------
// POINTER
// ------------------------------------------------------------------
const POINTER_ESCAPE = '~[01]'
const POINTER_TOKEN = `(?:[^~/]|${POINTER_ESCAPE})`
const POINTER_POINTER = `(?:/${POINTER_TOKEN}*)*`
const POINTER_FRAGMENT_TOKEN = `(?:[a-z${CHAR_DIGIT}_\\-.!$&'()*+,;:=@]|${URI_PCT}|${POINTER_ESCAPE})`
// ------------------------------------------------------------------
// FORMATS
// ------------------------------------------------------------------
export const FORMAT_DATE = new RegExp(`^(${TIME_FOUR_DIGITS})-(${TIME_TWO_DIGITS})-(${TIME_TWO_DIGITS})$`)
export const FORMAT_TIME = new RegExp(`^(${TIME_TWO_DIGITS}):(${TIME_TWO_DIGITS}):(${TIME_TWO_DIGITS})(?:\\.${CHAR_DIGIT}+)?(?:([Zz])|([+-])(${TIME_OFFSET_HOUR}):(${TIME_OFFSET_MINUTE}))?$`)
export const FORMAT_DATE_TIME_SUFFIX = new RegExp(`^${TIME_SUFFIX}$`)
export const FORMAT_DURATION = new RegExp(
  `^P(?:${CHAR_DIGIT}+(?:W|(?:Y(?:${CHAR_DIGIT}+M(?:${CHAR_DIGIT}+D)?)?|M(?:${CHAR_DIGIT}+D)?|D)(?:T${CHAR_DIGIT}+(?:H(?:${CHAR_DIGIT}+M(?:${CHAR_DIGIT}+S)?)?|M(?:${CHAR_DIGIT}+S)?|S))?)|T${CHAR_DIGIT}+(?:H(?:${CHAR_DIGIT}+M(?:${CHAR_DIGIT}+S)?)?|M(?:${CHAR_DIGIT}+S)?|S))$`
)
export const FORMAT_EMAIL = new RegExp(`^${EMAIL_LOCAL_PART}@${EMAIL_DOMAIN}$`, 'i')
export const FORMAT_EMAIL_ASCII = new RegExp(`^${EMAIL_ASCII_LOCAL_PART}@${EMAIL_ASCII_DOMAIN}$`, 'i')
export const FORMAT_IDN_EMAIL_LOCAL = new RegExp(`^${EMAIL_IDN_LOCAL_PART}$`, 'iu')
export const FORMAT_HOST_ASCII_LDH_LABEL = new RegExp(`^${HOST_ASCII_LDH_LABEL_CONTENT}$`, 'i')
export const FORMAT_HOSTNAME_ASCII_LDH = new RegExp(`^${HOST_ASCII_LDH_HOSTNAME}$`, 'i')
export const FORMAT_IPV4 = new RegExp(`^${ADDR_IPV4}$`, 'i')
export const FORMAT_IPV6 = new RegExp(`^(?:${ADDR_IPV6})$(?![\\s\\S])`, 'i')
export const FORMAT_JSON_POINTER = new RegExp(`^${POINTER_POINTER}$`)
export const FORMAT_JSON_POINTER_URI_FRAGMENT = new RegExp(`^#(?:/${POINTER_FRAGMENT_TOKEN}*)*$`, 'i')
export const FORMAT_RELATIVE_JSON_POINTER = new RegExp(`^(?:0|[1-9]${CHAR_DIGIT}*)(?:#|${POINTER_POINTER})$`)
export const FORMAT_URI_TEMPLATE = new RegExp(`^(?:${URI_LITERAL}|${URI_EXPRESSION})*$`)
export const FORMAT_URI = new RegExp(`^${URI_SCHEME}:${URI_HIER_PART}(?:\\?${URI_QUERY_OR_FRAGMENT})?(?:#${URI_QUERY_OR_FRAGMENT})?$(?![\\s\\S])`, 'i')
export const FORMAT_URI_REFERENCE = new RegExp(`^(?:${URI_SCHEME}:${URI_HIER_PART}|${URI_RELATIVE_PART})(?:\\?${URI_QUERY_OR_FRAGMENT})?(?:#${URI_QUERY_OR_FRAGMENT})?$(?![\\s\\S])`, 'i')
export const FORMAT_IRI_INVALID_CHARS = new RegExp(IRI_INVALID_CHARS)
export const FORMAT_IRI_INVALID_PERCENT_ENCODING = new RegExp(IRI_INVALID_PERCENT_ENCODING)
export const FORMAT_IRI_REFERENCE_INVALID_CHARS = new RegExp(IRI_REFERENCE_INVALID_CHARS)
export const FORMAT_IRI_REFERENCE_MALFORMED_SCHEME = new RegExp(IRI_REFERENCE_MALFORMED_SCHEME, 'i')
export const FORMAT_URL = new RegExp(`^${URL_SCHEME}:\\/\\/${URL_USER_INFO}${URL_HOST}${URL_PORT}${URL_PATH}$`, 'iu')
export const FORMAT_UUID = new RegExp(`^${CHAR_HEX_DIGIT}{8}-(?:${CHAR_HEX_DIGIT}{4}-){3}${CHAR_HEX_DIGIT}{12}$`, 'i')
