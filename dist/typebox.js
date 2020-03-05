"use strict";
/*--------------------------------------------------------------------------

TypeBox: JSONSchema Type Builder with Static Type Resolution for TypeScript

The MIT License (MIT)

Copyright (c) 2020 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
Object.defineProperty(exports, "__esModule", { value: true });
function reflect(value) {
    switch (typeof value) {
        case 'string': return 'string';
        case 'number': return 'number';
        case 'boolean': return 'boolean';
        default: return 'unknown';
    }
}
// Type Builder
class Type {
    // #region Modifiers
    /** Modifies the inner type T into an optional T. */
    static Optional(item) {
        return { ...item, modifier: 'optional' };
    }
    /** Modifies the inner type T into an readonly T. */
    static Readonly(item) {
        return { ...item, modifier: 'readonly' };
    }
    // #endregion
    // #region Primitives
    /** Creates a Object type with the given properties. */
    static Object(properties) {
        const property_names = Object.keys(properties);
        const optional = property_names.filter(name => {
            const candidate = properties[name];
            return (candidate.modifier && candidate.modifier === 'optional');
        });
        const required = property_names.filter(name => !optional.includes(name));
        return { type: 'object', properties, required };
    }
    /** Creates a Map type of the given type. Keys are indexed with type string. */
    static Map(additionalProperties) {
        return { type: 'object', additionalProperties };
    }
    /** Creates an Array type of the given argument T. */
    static Array(items) {
        return { type: 'array', items };
    }
    /** Creates a String type. */
    static String() {
        return { type: 'string' };
    }
    /** Creates a Number type. */
    static Number() {
        return { type: 'number' };
    }
    /** Creates a Boolean type. */
    static Boolean() {
        return { type: 'boolean' };
    }
    /** Creates a Null type. */
    static Null() {
        return { type: 'null' };
    }
    /** Creates a Any type. */
    static Any() {
        return {};
    }
    // #endregion
    // #region PrimitiveExtended
    /** Creates a Promise type. */
    static Promise(t) {
        return { type: 'promise', item: t };
    }
    /** Creates a Void type. */
    static Void() {
        return { type: 'void' };
    }
    /** Creates a Undefined type. */
    static Undefined() {
        return { type: 'undefined' };
    }
    /** Creates a Literal for the given value. */
    static Literal(value) {
        const type = reflect(value);
        if (type === 'unknown') {
            throw Error('Invalid literal value');
        }
        return { type, enum: [value] };
    }
    /** Creates a Union type for the given arguments. */
    static Union(...types) {
        return { oneOf: [...types] };
    }
    /** Creates an Intersect type for the given arguments. */
    static Intersect(...types) {
        return { allOf: [...types] };
    }
    /** Creates a Tuple type for the given arguments. */
    static Tuple(...types) {
        const type = 'array';
        const additionalItems = false;
        const minItems = types.length;
        const maxItems = types.length;
        return { type, items: [...types], additionalItems, minItems, maxItems };
    }
    /** Creates a Function type for the given arguments. */
    static Function(args, returns) {
        return { type: 'function', arguments: args, returns: returns };
    }
    // #endregion
    // #region Extended
    /** Creates a Pattern type that resolves to a string. */
    static Pattern(regex) {
        return { type: 'string', pattern: regex.source };
    }
    /** Creates a Format type that resolves to a string. */
    static Format(format) {
        return { type: 'string', format };
    }
    /** Creates a Range type that resolves to a number. */
    static Range(minimum, maximum) {
        return { type: 'number', minimum, maximum };
    }
    // #endregion
    // #region Experimental
    /** Creates a Pattern type to validate UUID-4. */
    static Guid() {
        return this.Pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
}
exports.Type = Type;
