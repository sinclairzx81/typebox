/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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

// deno-fmt-ignore-file
// deno-coverage-ignore-start

import { TValidationError } from '../../error/index.ts'

/** Greek (Greece) - ISO 639-1 language code 'el' with ISO 3166-1 alpha-2 country code 'GR' for Greece. */
export function el_GR(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'δεν πρέπει να έχει επιπλέον ιδιότητες'
    case 'anyOf': return 'πρέπει να ταιριάζει με ένα σχήμα στο anyOf'
    case 'boolean': return 'το σχήμα είναι ψευδές'
    case 'const': return 'πρέπει να είναι ίσο με τη σταθερά'
    case 'contains': return 'πρέπει να περιέχει τουλάχιστον 1 έγκυρο στοιχείο'
    case 'dependencies': return `πρέπει να έχει ιδιότητες ${error.params.dependencies.join(', ')} όταν υπάρχει η ιδιότητα ${error.params.property}`
    case 'dependentRequired': return `πρέπει να έχει ιδιότητες ${error.params.dependencies.join(', ')} όταν υπάρχει η ιδιότητα ${error.params.property}`
    case 'enum': return 'πρέπει να είναι ίσο με μία από τις επιτρεπόμενες τιμές'
    case 'exclusiveMaximum': return `πρέπει να είναι ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `πρέπει να είναι ${error.params.comparison} ${error.params.limit}`
    case 'format': return `πρέπει να ταιριάζει με τη μορφή "${error.params.format}"`
    case 'if': return `πρέπει να ταιριάζει με το σχήμα "${error.params.failingKeyword}"`
    case 'maxItems': return `δεν πρέπει να έχει περισσότερα από ${error.params.limit} στοιχεία`
    case 'maxLength': return `δεν πρέπει να έχει περισσότερους από ${error.params.limit} χαρακτήρες`
    case 'maxProperties': return `δεν πρέπει να έχει περισσότερες από ${error.params.limit} ιδιότητες`
    case 'maximum': return `πρέπει να είναι ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `δεν πρέπει να έχει λιγότερα από ${error.params.limit} στοιχεία`
    case 'minLength': return `δεν πρέπει να έχει λιγότερους από ${error.params.limit} χαρακτήρες`
    case 'minProperties': return `δεν πρέπει να έχει λιγότερες από ${error.params.limit} ιδιότητες`
    case 'minimum': return `πρέπει να είναι ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `πρέπει να είναι πολλαπλάσιο του ${error.params.multipleOf}`
    case 'not': return 'δεν πρέπει να είναι έγκυρο'
    case 'oneOf': return 'πρέπει να ταιριάζει με ένα μόνο σχήμα στο oneOf'
    case 'pattern': return `πρέπει να ταιριάζει με το μοτίβο "${error.params.pattern}"`
    case 'propertyNames': return `τα ονόματα ιδιοτήτων ${error.params.propertyNames.join(', ')} είναι μη έγκυρα`
    case 'required': return `πρέπει να έχει τις απαιτούμενες ιδιότητες ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `πρέπει να είναι ${error.params.type}` : `πρέπει να είναι είτε ${error.params.type.join(' ή ')}`
    case 'unevaluatedItems': return 'δεν πρέπει να έχει μη αξιολογημένα στοιχεία'
    case 'unevaluatedProperties': return 'δεν πρέπει να έχει μη αξιολογημένες ιδιότητες'
    case 'uniqueItems': return `δεν πρέπει να έχει διπλά στοιχεία`
    case '~refine': return error.params.message
    case '~standard': return `πρέπει να ταιριάζει με το σχήμα ${error.params.vendor}`
    default: return 'προέκυψε ένα άγνωστο σφάλμα επικύρωσης'
  }
}
// deno-coverage-ignore-stop