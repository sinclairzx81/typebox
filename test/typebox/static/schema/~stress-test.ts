import { Static } from 'typebox'

// ------------------------------------------------------------------
// Stress
// ------------------------------------------------------------------
function stress(value: Static<typeof A>) {
  const { items, orderId, payment } = value.orders[0]
  const { rating, reviewId, userId } = value.products[0].reviews![0]
  const { city, country, street, isDefault } = value.users[0].profile!.addresses![0]
}
// ------------------------------------------------------------------
// Schematic
// ------------------------------------------------------------------
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
