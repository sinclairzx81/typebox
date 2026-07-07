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

export const Draft_2019_09 = {
  '$schema': 'https://json-schema.org/draft/2019-09/schema',
  '$id': 'https://json-schema.org/draft/2019-09/schema',
  '$vocabulary': {
    'https://json-schema.org/draft/2019-09/vocab/core': true,
    'https://json-schema.org/draft/2019-09/vocab/applicator': true,
    'https://json-schema.org/draft/2019-09/vocab/validation': true,
    'https://json-schema.org/draft/2019-09/vocab/meta-data': true,
    'https://json-schema.org/draft/2019-09/vocab/format': false,
    'https://json-schema.org/draft/2019-09/vocab/content': true
  },
  '$recursiveAnchor': true,
  'title': 'Core and Validation specifications meta-schema',
  'allOf': [
    {
      '$schema': 'https://json-schema.org/draft/2019-09/schema',
      '$id': 'https://json-schema.org/draft/2019-09/meta/core',
      '$recursiveAnchor': true,

      'title': 'Core vocabulary meta-schema',
      'type': ['object', 'boolean'],
      'properties': {
        '$id': {
          'type': 'string',
          'format': 'uri-reference',
          '$comment': 'Non-empty fragments not allowed.',
          'pattern': '^[^#]*#?$'
        },
        '$schema': {
          'type': 'string',
          'format': 'uri'
        },
        '$anchor': {
          'type': 'string',
          'pattern': '^[A-Za-z][-A-Za-z0-9.:_]*$'
        },
        '$ref': {
          'type': 'string',
          'format': 'uri-reference'
        },
        '$recursiveRef': {
          'type': 'string',
          'format': 'uri-reference'
        },
        '$recursiveAnchor': {
          'type': 'boolean',
          'default': false
        },
        '$vocabulary': {
          'type': 'object',
          'propertyNames': {
            'type': 'string',
            'format': 'uri'
          },
          'additionalProperties': {
            'type': 'boolean'
          }
        },
        '$comment': {
          'type': 'string'
        },
        '$defs': {
          'type': 'object',
          'additionalProperties': { '$recursiveRef': '#' },
          'default': {}
        }
      }
    },
    {
      '$schema': 'https://json-schema.org/draft/2019-09/schema',
      '$id': 'https://json-schema.org/draft/2019-09/meta/applicator',
      '$recursiveAnchor': true,

      'title': 'Applicator vocabulary meta-schema',
      'type': ['object', 'boolean'],
      'properties': {
        'additionalItems': { '$recursiveRef': '#' },
        'unevaluatedItems': { '$recursiveRef': '#' },
        'items': {
          'anyOf': [
            { '$recursiveRef': '#' },
            { '$ref': '#/$defs/schemaArray' }
          ]
        },
        'contains': { '$recursiveRef': '#' },
        'additionalProperties': { '$recursiveRef': '#' },
        'unevaluatedProperties': { '$recursiveRef': '#' },
        'properties': {
          'type': 'object',
          'additionalProperties': { '$recursiveRef': '#' },
          'default': {}
        },
        'patternProperties': {
          'type': 'object',
          'additionalProperties': { '$recursiveRef': '#' },
          'propertyNames': { 'format': 'regex' },
          'default': {}
        },
        'dependentSchemas': {
          'type': 'object',
          'additionalProperties': {
            '$recursiveRef': '#'
          }
        },
        'propertyNames': { '$recursiveRef': '#' },
        'if': { '$recursiveRef': '#' },
        'then': { '$recursiveRef': '#' },
        'else': { '$recursiveRef': '#' },
        'allOf': { '$ref': '#/$defs/schemaArray' },
        'anyOf': { '$ref': '#/$defs/schemaArray' },
        'oneOf': { '$ref': '#/$defs/schemaArray' },
        'not': { '$recursiveRef': '#' }
      },
      '$defs': {
        'schemaArray': {
          'type': 'array',
          'minItems': 1,
          'items': { '$recursiveRef': '#' }
        }
      }
    },
    {
      '$schema': 'https://json-schema.org/draft/2019-09/schema',
      '$id': 'https://json-schema.org/draft/2019-09/meta/validation',
      '$recursiveAnchor': true,

      'title': 'Validation vocabulary meta-schema',
      'type': ['object', 'boolean'],
      'properties': {
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
        'maxLength': { '$ref': '#/$defs/nonNegativeInteger' },
        'minLength': { '$ref': '#/$defs/nonNegativeIntegerDefault0' },
        'pattern': {
          'type': 'string',
          'format': 'regex'
        },
        'maxItems': { '$ref': '#/$defs/nonNegativeInteger' },
        'minItems': { '$ref': '#/$defs/nonNegativeIntegerDefault0' },
        'uniqueItems': {
          'type': 'boolean',
          'default': false
        },
        'maxContains': { '$ref': '#/$defs/nonNegativeInteger' },
        'minContains': {
          '$ref': '#/$defs/nonNegativeInteger',
          'default': 1
        },
        'maxProperties': { '$ref': '#/$defs/nonNegativeInteger' },
        'minProperties': { '$ref': '#/$defs/nonNegativeIntegerDefault0' },
        'required': { '$ref': '#/$defs/stringArray' },
        'dependentRequired': {
          'type': 'object',
          'additionalProperties': {
            '$ref': '#/$defs/stringArray'
          }
        },
        'const': true,
        'enum': {
          'type': 'array',
          'items': true
        },
        'type': {
          'anyOf': [
            { '$ref': '#/$defs/simpleTypes' },
            {
              'type': 'array',
              'items': { '$ref': '#/$defs/simpleTypes' },
              'minItems': 1,
              'uniqueItems': true
            }
          ]
        }
      },
      '$defs': {
        'nonNegativeInteger': {
          'type': 'integer',
          'minimum': 0
        },
        'nonNegativeIntegerDefault0': {
          '$ref': '#/$defs/nonNegativeInteger',
          'default': 0
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
      }
    },
    {
      '$schema': 'https://json-schema.org/draft/2019-09/schema',
      '$id': 'https://json-schema.org/draft/2019-09/meta/meta-data',
      '$recursiveAnchor': true,

      'title': 'Meta-data vocabulary meta-schema',

      'type': ['object', 'boolean'],
      'properties': {
        'title': {
          'type': 'string'
        },
        'description': {
          'type': 'string'
        },
        'default': true,
        'deprecated': {
          'type': 'boolean',
          'default': false
        },
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
        }
      }
    },
    {
      '$schema': 'https://json-schema.org/draft/2019-09/schema',
      '$id': 'https://json-schema.org/draft/2019-09/meta/format',
      '$recursiveAnchor': true,

      'title': 'Format vocabulary meta-schema',
      'type': ['object', 'boolean'],
      'properties': {
        'format': { 'type': 'string' }
      }
    },
    {
      '$schema': 'https://json-schema.org/draft/2019-09/schema',
      '$id': 'https://json-schema.org/draft/2019-09/meta/content',
      '$recursiveAnchor': true,

      'title': 'Content vocabulary meta-schema',

      'type': ['object', 'boolean'],
      'properties': {
        'contentMediaType': { 'type': 'string' },
        'contentEncoding': { 'type': 'string' },
        'contentSchema': { '$recursiveRef': '#' }
      }
    }
  ],
  'type': ['object', 'boolean'],
  'properties': {
    'definitions': {
      '$comment': 'While no longer an official keyword as it is replaced by $defs, this keyword is retained in the meta-schema to prevent incompatible extensions as it remains in common use.',
      'type': 'object',
      'additionalProperties': { '$recursiveRef': '#' },
      'default': {}
    },
    'dependencies': {
      '$comment': '"dependencies" is no longer a keyword, but schema authors should avoid redefining it to facilitate a smooth transition to "dependentSchemas" and "dependentRequired"',
      'type': 'object',
      'additionalProperties': {
        'anyOf': [
          { '$recursiveRef': '#' },
          { '$ref': 'meta/validation#/$defs/stringArray' }
        ]
      }
    }
  }
} as const