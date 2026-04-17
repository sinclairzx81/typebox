import { Assert } from 'test'
import Type, { type Static } from 'typebox'
import type { XStatic } from 'typebox/schema'

// ------------------------------------------------------------------
// Pathological: Structural
// ------------------------------------------------------------------
{
  function stress(value: XStatic<typeof A>) {
    const { items, orderId, payment } = value.orders[0]
    const { rating, reviewId, userId } = value.products[0].reviews![0]
    const { city, country, street, isDefault } = value.users[0].profile!.addresses![0]
  }
  const A = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    '$id': 'https://example.com/ecommerce.schema.json',
    'title': 'E-Commerce Platform',
    'type': 'object',
    'properties': {
      'platformName': {
        'type': 'string',
        'minLength': 1,
        'maxLength': 100
      },
      'version': {
        'type': 'string',
        'pattern': '^[0-9]+\\.[0-9]+\\.[0-9]+$'
      },
      'users': {
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {
            'userId': {
              'type': 'string',
              'format': 'uuid'
            },
            'username': {
              'type': 'string',
              'minLength': 3,
              'maxLength': 30
            },
            'email': {
              'type': 'string',
              'format': 'email'
            },
            'role': {
              'type': 'string',
              'enum': ['customer', 'seller', 'admin']
            },
            'isActive': {
              'type': 'boolean'
            },
            'createdAt': {
              'type': 'string',
              'format': 'date-time'
            },
            'profile': {
              'type': 'object',
              'properties': {
                'firstName': { 'type': 'string' },
                'lastName': { 'type': 'string' },
                'dob': { 'type': 'string', 'format': 'date' },
                'addresses': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'street': { 'type': 'string' },
                      'city': { 'type': 'string' },
                      'state': { 'type': 'string' },
                      'postalCode': { 'type': 'string' },
                      'country': { 'type': 'string' },
                      'isDefault': { 'type': 'boolean' }
                    },
                    'required': ['street', 'city', 'country']
                  }
                },
                'phoneNumbers': {
                  'type': 'array',
                  'items': {
                    'type': 'string',
                    'pattern': '^\\+?[0-9\\- ]{7,15}$'
                  }
                }
              },
              'required': ['firstName', 'lastName']
            },
            'paymentMethods': {
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'methodId': { 'type': 'string', 'format': 'uuid' },
                  'type': { 'type': 'string', 'enum': ['card', 'paypal', 'crypto'] },
                  'cardNumber': { 'type': 'string', 'pattern': '^[0-9]{16}$' },
                  'expiry': { 'type': 'string', 'pattern': '^(0[1-9]|1[0-2])\\/[0-9]{2}$' },
                  'paypalEmail': { 'type': 'string', 'format': 'email' },
                  'walletAddress': { 'type': 'string' }
                },
                'required': ['methodId', 'type'],
                'allOf': [
                  {
                    'if': { 'properties': { 'type': { 'const': 'card' } } },
                    'then': { 'required': ['cardNumber', 'expiry'] }
                  },
                  {
                    'if': { 'properties': { 'type': { 'const': 'paypal' } } },
                    'then': { 'required': ['paypalEmail'] }
                  },
                  {
                    'if': { 'properties': { 'type': { 'const': 'crypto' } } },
                    'then': { 'required': ['walletAddress'] }
                  }
                ]
              }
            }
          },
          'required': ['userId', 'username', 'email', 'role', 'createdAt']
        }
      },
      'products': {
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {
            'productId': { 'type': 'string', 'format': 'uuid' },
            'name': { 'type': 'string', 'minLength': 1, 'maxLength': 200 },
            'description': { 'type': 'string' },
            'price': { 'type': 'number', 'minimum': 0 },
            'currency': { 'type': 'string', 'pattern': '^[A-Z]{3}$' },
            'categories': {
              'type': 'array',
              'items': { 'type': 'string' },
              'minItems': 1
            },
            'stock': {
              'type': 'object',
              'properties': {
                'quantity': { 'type': 'integer', 'minimum': 0 },
                'warehouse': { 'type': 'string' }
              },
              'required': ['quantity']
            },
            'images': {
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'url': { 'type': 'string', 'format': 'uri' },
                  'altText': { 'type': 'string' },
                  'isPrimary': { 'type': 'boolean' }
                },
                'required': ['url']
              }
            },
            'reviews': {
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'reviewId': { 'type': 'string', 'format': 'uuid' },
                  'userId': { 'type': 'string', 'format': 'uuid' },
                  'rating': { 'type': 'integer', 'minimum': 1, 'maximum': 5 },
                  'comment': { 'type': 'string' },
                  'createdAt': { 'type': 'string', 'format': 'date-time' }
                },
                'required': ['reviewId', 'userId', 'rating']
              }
            }
          },
          'required': ['productId', 'name', 'price', 'currency', 'stock']
        }
      },
      'orders': {
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {
            'orderId': { 'type': 'string', 'format': 'uuid' },
            'userId': { 'type': 'string', 'format': 'uuid' },
            'items': {
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'productId': { 'type': 'string', 'format': 'uuid' },
                  'quantity': { 'type': 'integer', 'minimum': 1 },
                  'priceAtPurchase': { 'type': 'number', 'minimum': 0 }
                },
                'required': ['productId', 'quantity', 'priceAtPurchase']
              }
            },
            'shippingAddress': {
              'type': 'object',
              'properties': {
                'street': { 'type': 'string' },
                'city': { 'type': 'string' },
                'state': { 'type': 'string' },
                'postalCode': { 'type': 'string' },
                'country': { 'type': 'string' }
              },
              'required': ['street', 'city', 'country']
            },
            'billingAddress': {
              'type': 'object',
              'properties': {
                'street': { 'type': 'string' },
                'city': { 'type': 'string' },
                'state': { 'type': 'string' },
                'postalCode': { 'type': 'string' },
                'country': { 'type': 'string' }
              },
              'required': ['street', 'city', 'country']
            },
            'payment': {
              'type': 'object',
              'properties': {
                'method': { 'type': 'string', 'enum': ['card', 'paypal', 'crypto'] },
                'transactionId': { 'type': 'string' },
                'amount': { 'type': 'number', 'minimum': 0 },
                'currency': { 'type': 'string', 'pattern': '^[A-Z]{3}$' }
              },
              'required': ['method', 'transactionId', 'amount', 'currency']
            },
            'status': {
              'type': 'string',
              'enum': ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
            },
            'createdAt': { 'type': 'string', 'format': 'date-time' },
            'updatedAt': { 'type': 'string', 'format': 'date-time' }
          },
          'required': ['orderId', 'userId', 'items', 'shippingAddress', 'payment', 'status']
        }
      }
    },
    'required': ['platformName', 'version', 'users', 'products', 'orders']
  } as const
}
// ------------------------------------------------------------------
// Pathological | Excessive Property Sets
// ------------------------------------------------------------------
{
  const A = Type.Union([
    Type.String(),
    Type.Number()
  ])
  const B = Type.Object({
    x0: Type.Optional(Type.String()),
    x1: Type.Optional(Type.Record(Type.String(), A)),
    x2: Type.String(),
    x3: Type.Object({
      x4: A,
      x5: A,
      x6: A,
      x7: A,
      x8: A,
      x9: A,
      x10: A,
      x11: A,
      x12: A,
      x13: A,
      x14: A,
      x15: A,
      x16: A,
      x17: A,
      x18: A,
      x19: A,
      x20: A,
      x21: A,
      x22: A,
      x23: A,
      x24: A,
      x25: A,
      x26: A,
      x27: A,
      x28: A,
      x29: A,
      x30: A,
      x31: A,
      x32: A,
      x33: A,
      x34: A,
      x35: A,
      x36: A,
      x37: A,
      x38: A,
      x39: A,
      x40: A,
      x41: A,
      x42: A,
      x43: A,
      x44: A,
      x45: A,
      x46: A,
      x47: A,
      x48: A,
      x49: A,
      x50: A,
      x51: A,
      x52: A,
      x53: A,
      x54: A,
      x55: A,
      x56: A,
      x57: A,
      x58: A,
      x59: A,
      x60: A,
      x61: A,
      x62: A,
      x63: A,
      x64: A,
      x65: A,
      x66: A,
      x67: A
    }),
    x68: Type.Optional(
      Type.Object({
        x69: Type.Optional(A),
        x70: Type.Optional(A),
        x71: Type.Optional(A)
      })
    )
  })
  type B_Static = Static<typeof B>
  Assert.IsExtends<B_Static, {
    x0?: string | undefined
    x1?: Record<string, string | number> | undefined
    x68?: {
      x69?: string | number | undefined
      x70?: string | number | undefined
      x71?: string | number | undefined
    } | undefined
    x2: string
    x3: {
      [x: string]: any
    }
  }>(true)
  // ----------------------------------------------------------------
  // For excessively large property sets, we try and gracefully
  // degrade to { [x: string]: any } which is a behavior of TS,
  // not TypeBox. The problem stems from required property
  // generation on the XStaticProperties inference path, and where
  // too many required elements cause TS to explode. I don't think
  // there is much that can be done about this.
  // ----------------------------------------------------------------
  type B_XStatic = XStatic<typeof B>
  Assert.IsExtends<B_XStatic, {
    x0?: string | undefined
    x1?: Record<string, string | number> | undefined
    x68?: {
      x69?: string | number | undefined
      x70?: string | number | undefined
      x71?: string | number | undefined
    } | undefined
    x2: string
    // x3: {
    //     [x: string]: any
    // };
  }>(true)
}
