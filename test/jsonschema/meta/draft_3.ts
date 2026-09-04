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

export const Draft_3 = {
  '$schema': 'http://json-schema.org/draft-03/schema#',
  'id': 'http://json-schema.org/draft-03/schema#',
  'type': 'object',

  'properties': {
    'type': {
      'type': ['string', 'array'],
      'items': {
        'type': ['string', { '$ref': '#' }]
      },
      'uniqueItems': true,
      'default': 'any'
    },

    'properties': {
      'type': 'object',
      'additionalProperties': { '$ref': '#' },
      'default': {}
    },

    'patternProperties': {
      'type': 'object',
      'additionalProperties': { '$ref': '#' },
      'default': {}
    },

    'additionalProperties': {
      'type': [{ '$ref': '#' }, 'boolean'],
      'default': {}
    },
    'items': {
      'type': [{ '$ref': '#' }, 'array'],
      'items': { '$ref': '#' },
      'default': {}
    },
    'additionalItems': {
      'type': [{ '$ref': '#' }, 'boolean'],
      'default': {}
    },
    'required': {
      'type': 'boolean',
      'default': false
    },
    'dependencies': {
      'type': 'object',
      'additionalProperties': {
        'type': ['string', 'array', { '$ref': '#' }],
        'items': {
          'type': 'string'
        }
      },
      'default': {}
    },
    'minimum': {
      'type': 'number'
    },
    'maximum': {
      'type': 'number'
    },
    'exclusiveMinimum': {
      'type': 'boolean',
      'default': false
    },
    'exclusiveMaximum': {
      'type': 'boolean',
      'default': false
    },
    'minItems': {
      'type': 'integer',
      'minimum': 0,
      'default': 0
    },
    'maxItems': {
      'type': 'integer',
      'minimum': 0
    },
    'uniqueItems': {
      'type': 'boolean',
      'default': false
    },
    'pattern': {
      'type': 'string',
      'format': 'regex'
    },
    'minLength': {
      'type': 'integer',
      'minimum': 0,
      'default': 0
    },
    'maxLength': {
      'type': 'integer'
    },
    'enum': {
      'type': 'array',
      'minItems': 1,
      'uniqueItems': true
    },
    'default': {
      'type': 'any'
    },
    'title': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'format': {
      'type': 'string'
    },
    'divisibleBy': {
      'type': 'number',
      'minimum': 0,
      'exclusiveMinimum': true,
      'default': 1
    },
    'disallow': {
      'type': ['string', 'array'],
      'items': {
        'type': ['string', { '$ref': '#' }]
      },
      'uniqueItems': true
    },
    'extends': {
      'type': [{ '$ref': '#' }, 'array'],
      'items': { '$ref': '#' },
      'default': {}
    },
    'id': {
      'type': 'string',
      'format': 'uri'
    },
    '$ref': {
      'type': 'string',
      'format': 'uri'
    },
    '$schema': {
      'type': 'string',
      'format': 'uri'
    }
  },
  'dependencies': {
    'exclusiveMinimum': 'minimum',
    'exclusiveMaximum': 'maximum'
  },
  'default': {}
} as const
