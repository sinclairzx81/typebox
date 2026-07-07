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

export const Draft_7 = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://json-schema.org/draft-07/schema#',
  'title': 'Core schema meta-schema',
  'definitions': {
    'schemaArray': {
      'type': 'array',
      'minItems': 1,
      'items': { '$ref': '#' }
    },
    'nonNegativeInteger': {
      'type': 'integer',
      'minimum': 0
    },
    'nonNegativeIntegerDefault0': {
      'allOf': [
        { '$ref': '#/definitions/nonNegativeInteger' },
        { 'default': 0 }
      ]
    },
    'simpleTypes': {
      'enum': [
        'array',
        'boolean',
        'integer',
        'null',
        'number',
        'object',
        'string'
      ]
    },
    'stringArray': {
      'type': 'array',
      'items': { 'type': 'string' },
      'uniqueItems': true,
      'default': []
    }
  },
  'type': ['object', 'boolean'],
  'properties': {
    '$id': {
      'type': 'string',
      'format': 'uri-reference'
    },
    '$schema': {
      'type': 'string',
      'format': 'uri'
    },
    '$ref': {
      'type': 'string',
      'format': 'uri-reference'
    },
    '$comment': {
      'type': 'string'
    },
    'title': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'default': true,
    'readOnly': {
      'type': 'boolean',
      'default': false
    },
    'writeOnly': {
      'type': 'boolean',
      'default': false
    },
    'examples': {
      'type': 'array',
      'items': true
    },
    'multipleOf': {
      'type': 'number',
      'exclusiveMinimum': 0
    },
    'maximum': {
      'type': 'number'
    },
    'exclusiveMaximum': {
      'type': 'number'
    },
    'minimum': {
      'type': 'number'
    },
    'exclusiveMinimum': {
      'type': 'number'
    },
    'maxLength': { '$ref': '#/definitions/nonNegativeInteger' },
    'minLength': { '$ref': '#/definitions/nonNegativeIntegerDefault0' },
    'pattern': {
      'type': 'string',
      'format': 'regex'
    },
    'additionalItems': { '$ref': '#' },
    'items': {
      'anyOf': [
        { '$ref': '#' },
        { '$ref': '#/definitions/schemaArray' }
      ],
      'default': true
    },
    'maxItems': { '$ref': '#/definitions/nonNegativeInteger' },
    'minItems': { '$ref': '#/definitions/nonNegativeIntegerDefault0' },
    'uniqueItems': {
      'type': 'boolean',
      'default': false
    },
    'contains': { '$ref': '#' },
    'maxProperties': { '$ref': '#/definitions/nonNegativeInteger' },
    'minProperties': { '$ref': '#/definitions/nonNegativeIntegerDefault0' },
    'required': { '$ref': '#/definitions/stringArray' },
    'additionalProperties': { '$ref': '#' },
    'definitions': {
      'type': 'object',
      'additionalProperties': { '$ref': '#' },
      'default': {}
    },
    'properties': {
      'type': 'object',
      'additionalProperties': { '$ref': '#' },
      'default': {}
    },
    'patternProperties': {
      'type': 'object',
      'additionalProperties': { '$ref': '#' },
      'propertyNames': { 'format': 'regex' },
      'default': {}
    },
    'dependencies': {
      'type': 'object',
      'additionalProperties': {
        'anyOf': [
          { '$ref': '#' },
          { '$ref': '#/definitions/stringArray' }
        ]
      }
    },
    'propertyNames': { '$ref': '#' },
    'const': true,
    'enum': {
      'type': 'array',
      'items': true,
      'minItems': 1,
      'uniqueItems': true
    },
    'type': {
      'anyOf': [
        { '$ref': '#/definitions/simpleTypes' },
        {
          'type': 'array',
          'items': { '$ref': '#/definitions/simpleTypes' },
          'minItems': 1,
          'uniqueItems': true
        }
      ]
    },
    'format': { 'type': 'string' },
    'contentMediaType': { 'type': 'string' },
    'contentEncoding': { 'type': 'string' },
    'if': { '$ref': '#' },
    'then': { '$ref': '#' },
    'else': { '$ref': '#' },
    'allOf': { '$ref': '#/definitions/schemaArray' },
    'anyOf': { '$ref': '#/definitions/schemaArray' },
    'oneOf': { '$ref': '#/definitions/schemaArray' },
    'not': { '$ref': '#' }
  },
  'default': true
} as const
